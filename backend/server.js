// backend/server.js (VERSIÓN FINAL, COMPLETA Y CORREGIDA)

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import db from './database/config.js'; // <-- CORRECCIÓN 1: Importa la conexión a la BD

// CORRECCIÓN 2: Importar desde el archivo correcto (plural)
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

app.set('trust proxy', 1);

// --- CONFIGURACIÓN MANUAL DE CORS (MÉTODO NUCLEAR) ---
app.use((req, res, next) => {
  // CORRECCIÓN 3: Limpia y corrige la lista de orígenes
  const allowedOrigins = [
    'http://localhost:5173',
    'http://192.168.137.1:5173',
    'http://192.168.1.7:5173',
    'https://pruebassaberpro.ipsuniversitariadecolombia.com'
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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

// --- INICIO DEL SERVIDOR Y MANEJO DE CIERRE ---

// CORRECCIÓN 4: Solo un app.listen()
const server = app.listen(port, () => {
  const url = process.env.NGROK_DOMAIN || `http://localhost:${port}`;
  console.log(`🚀 Servidor corriendo en: ${url}`);
});

// Lógica de cierre elegante (actualizado para PostgreSQL Pool)
const gracefulShutdown = async () => {
  console.log('🔌 Recibida señal de cierre. Cerrando conexiones...');
  server.close(async () => {
    console.log('🚪 Servidor HTTP cerrado.');
    try {
      await db.end();
      console.log('✅ Conexión a la BD cerrada limpiamente.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error al cerrar la conexión a la BD:', err.message);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);