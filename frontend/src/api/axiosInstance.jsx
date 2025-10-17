import axios from 'axios';

// 1. Crea la instancia de Axios
const api = axios.create({

  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/', // URL de tu backend desde .env

  headers: {
    'Content-Type': 'application/json',
  },
  // --- CAMBIO CLAVE AQUÍ ---
  // 2. Habilita el envío de credenciales (cookies) en todas las peticiones
  withCredentials: true,
});

// 3. ¡El interceptor para el token de sesión ya NO es necesario!
//    El navegador adjuntará la cookie 'jwt' automáticamente en cada petición a 'http://localhost:3000'.
//    Puedes eliminar el interceptor completamente.

// 4. Exporta la instancia configurada
export default api;