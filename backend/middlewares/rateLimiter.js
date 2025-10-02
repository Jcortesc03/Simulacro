// backend/middlewares/rateLimiters.js (CÓDIGO FINAL Y CORRECTO)

import rateLimit from 'express-rate-limit';

// Limitador para login: más permisivo y específico
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // permitimos más intentos antes de bloquear
  message: 'Demasiados intentos de autenticación desde esta IP. Por favor, inténtelo de nuevo después de 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // ✅ No contar intentos exitosos
});

// Limitador general para el resto de la API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Demasiadas peticiones desde esta IP. Por favor, inténtelo de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});