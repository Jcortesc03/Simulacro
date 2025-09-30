// backend/server.js (VERSIÓN FINAL Y LIMPIA)

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// Importa el limitador general para el resto de la API
import { generalLimiter } from './middlewares/rateLimiter.js';

// Importa las rutas
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

// 1. Confiar en el primer proxy (importante para NGROK o despliegues detrás de un proxy)
app.set('trust proxy', 1);

// 2. Helmet: añade 11 capas de seguridad de encabezados HTTP
app.use(helmet());

// 3. CORS: permite peticiones del frontend con credenciales
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// 4. Middlewares para parsear el cuerpo de la petición y las cookies
app.use(express.json());
app.use(cookieParser());

// 5. Rate Limiter General: se aplica a todas las rutas que vienen después
app.use(generalLimiter);


// --- RUTAS DE LA APLICACIÓN ---
// Las rutas de autenticación ya tienen su propio limitador más estricto
app.use('/auth', userRouter);

// El resto de las rutas usarán el 'generalLimiter'
app.use('/AI', AIRouter);
app.use('/questions', questionRouter);
app.use('/tests', testsRouter);
app.use('/admin', adminRouter);
app.use('/categories', categoriesRouter);


app.listen(port, () => {
  const url = process.env.NGROOK_DOMAIN || `http://localhost:${port}`;
  console.log(`🚀 Servidor corriendo en: ${url}`);
});