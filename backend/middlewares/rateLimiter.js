// backend/middlewares/rateLimiters.js (CÓDIGO FINAL Y CORRECTO)

import rateLimit from 'express-rate-limit';

// Limitador para endpoints de autenticación (muy estricto)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Límite de 10 peticiones por IP
  message: 'Demasiados intentos de autenticación desde esta IP. Por favor, inténtelo de nuevo después de 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitador general para el resto de la API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Demasiadas peticiones desde esta IP. Por favor, inténtelo de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});