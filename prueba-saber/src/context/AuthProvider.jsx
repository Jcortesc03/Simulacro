import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../config';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  // Estado para almacenar los datos del usuario logueado (ej. { email, roleId })
  // Empieza como 'null' (nadie logueado).
  const [user, setUser] = useState(null);
  // Estado para saber si la autenticación inicial ya se verificó.
  const [loading, setLoading] = useState(true);

  // --- EFECTO PARA VERIFICAR SESIÓN AL CARGAR LA APP ---
  // Este efecto se ejecuta una sola vez cuando la aplicación se carga.
  // Su misión es revisar si ya existe un token válido en el localStorage.
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Comprueba si el token ha expirado
        if (decodedToken.exp * 1000 > Date.now()) {
          // Si el token es válido, establecemos los datos del usuario
          setUser({ email: decodedToken.email, roleId: decodedToken.role_id });
        } else {
          // Si el token ha expirado, lo eliminamos
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false); // Terminamos la carga inicial
  }, []);

  // --- FUNCIÓN DE LOGIN ---
  const login = async (email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, { email, password });
      const { token } = response.data;

      if (token) {
        localStorage.setItem('authToken', token);
        const decodedToken = jwtDecode(token);
        const userData = { email: decodedToken.email, roleId: decodedToken.role_id };
        setUser(userData);
        return userData; // Devuelve los datos para la redirección
      }
    } catch (error) {
      console.error("Error en el login:", error);
      // Lanza el mensaje de error del backend (ej. "Usuario no existente")
      throw error.response?.data || "Error al conectar con el servidor";
    }
  };

  // --- FUNCIÓN DE REGISTRO ---
  const register = async (userData) => {
    try {
      // Tu backend espera 'name', 'career', y 'email', 'password'
      const response = await axios.post(API_ENDPOINTS.REGISTER, userData, {
        name: userData.name,
        programName: userData.programName, // Basado en tu último esquema de DB
        email: userData.email,
        password: userData.password,
      });
      return response.data; // Devuelve el mensaje de éxito del backend
    } catch (error) {
      console.error("Error en el registro:", error);
      // Lanza el mensaje de error del backend (ej. "Todos los campos son obligatorios")
      throw error.response?.data?.message || "Error al conectar con el servidor";
    }
  };

  // --- FUNCIÓN DE LOGOUT ---
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    // Opcional: Redirigir al login
    // window.location.href = '/login';
  };

  // El valor que se comparte con toda la aplicación
  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user, // Un booleano simple para saber si hay un usuario
    loading, // Para saber si la verificación inicial ya terminó
  };

  // Si aún está cargando/verificando el token, no renderiza el resto de la app.
  // Esto previene un "parpadeo" donde el usuario ve la página de login por un segundo.
  if (loading) {
    return <div>Cargando aplicación...</div>;
  }

  // Una vez cargado, provee el contexto a toda la aplicación.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};