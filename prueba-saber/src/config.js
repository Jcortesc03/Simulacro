// src/config.js

// Asegúrate de que este puerto coincida con el de tu backend (en tu index.js es 3000 o el del .env)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_ENDPOINTS = {
  // Las rutas coinciden con tu backend: '/auth/register' y '/auth/login'
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
};