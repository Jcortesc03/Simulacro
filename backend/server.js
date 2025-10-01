  // backend/server.js (VERSIÓN FINAL CON CORS MANUAL)

  import express from 'express';
  import dotenv from 'dotenv';
  // No importamos 'cors' porque lo haremos manualmente
  import cookieParser from 'cookie-parser';
  import helmet from 'helmet';

  import { generalLimiter } from './middlewares/rateLimiter.js';
  import userRouter from './router/userRoutes.js';
  import AIRouter from './router/AIRoutes.js';
  import adminRouter from './router/adminRoutes.js'
  import questionRouter from './router/questionRoutes.js'
  import testsRouter from './router/testsRoutes.js'
  import categoriesRouter from './router/categoriesRoutes.js';

  dotenv.config();

  const port = process.env.PORT || 3000;
  const app = express();

  // --- CONFIGURACIÓN DE MIDDLEWARES DE SEGURIDAD (EN ORDEN) ---

  app.set('trust proxy', 1);

  // --- CONFIGURACIÓN MANUAL DE CORS (MÉTODO NUCLEAR) ---
  app.use((req, res, next) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://192.168.1.212:5173',
      'https://fc3184a3e01a.ngrok-free.app' // ¡ASEGÚRATE DE QUE ESTA IP ES CORRECTA!
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Si es una petición pre-vuelo (OPTIONS), el navegador solo quiere saber los headers.
    // Respondemos con 200 OK y terminamos aquí.
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });

  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
  app.use(generalLimiter);

  // --- RUTAS DE LA APLICACIÓN ---
  app.use('/auth', userRouter);
  app.use('/AI', AIRouter);
  app.use('/questions', questionRouter);
  app.use('/tests', testsRouter);
  app.use('/admin', adminRouter);
  app.use('/categories', categoriesRouter);

  app.listen(port, () => {
    const url = process.env.NGROK_DOMAIN || `http://localhost:${port}`;
    console.log(`🚀 Servidor corriendo en: ${url}`);
  });