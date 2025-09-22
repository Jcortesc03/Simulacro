import axios from 'axios';

// 2. Crea la instancia
const api = axios.create({
  baseURL: 'http://192.168.1.245:3000/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Interceptor para agregar el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Exporta por defecto
export default api;
