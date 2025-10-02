import axios from 'axios';

// 1. Crea la instancia de Axios
const api = axios.create({

  baseURL: 'http://192.168.1.7:3000/', // URL de tu backend. Asegúrate que coincida con la del .env

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