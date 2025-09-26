import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './router/userRoutes.js';
import AIRouter from './router/AIRoutes.js';
import adminRouter from './router/adminRoutes.js'
import questionRouter from './router/questionRoutes.js'
import testsRouter from './router/testsRoutes.js'
import rateLimiter from './middlewares/rateLimiter.js'
import categoriesRouter from './router/categoriesRoutes.js';

dotenv.config();


const port = process.env.PORT || 2000
const app = express();

// --- MODIFICACIONES AQUÍ ---
app.use(express.json()); // Necesario para parsear JSON en el body
app.use(cookieParser()); // Nuevo Middleware para parsear cookies en req.cookies

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Reemplaza con la URL de tu frontend en producción
  credentials: true, // Esto es CRUCIAL para enviar y recibir cookies con CORS
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos, Authorization seguirá siendo importante para otros tokens (ej. email verification)
}));

app.use(rateLimiter);
app.set('trust proxy', 1); //Para probar con ngrok

app.use('/auth', userRouter);
app.use('/AI', AIRouter);
app.use('/questions', questionRouter);
app.use('/tests', testsRouter);
app.use('/admin', adminRouter);
app.use('/categories', categoriesRouter);

app.listen(port, () => {
  const url = process.env.NGROOK_DOMAIN
    ? process.env.NGROOK_DOMAIN
    : `http://localhost:${port}`;

  console.log(`🚀 Servidor corriendo en: ${url}`);
});
