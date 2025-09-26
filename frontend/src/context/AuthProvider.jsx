// context/AuthProvider.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { AuthContext } from "./AuthContext.jsx";
import api from "../api/axiosInstance.jsx";
import { useNavigate } from "react-router-dom"; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber si estamos verificando el token
    const navigate = useNavigate(); 

 // --- LÓGICA DE VERIFICACIÓN DE SESIÓN ACTUALIZADA ---
  useEffect(() => {
    // Al cargar la app, intentamos obtener el perfil del usuario.
    // Si el navegador tiene la cookie 'jwt', esta petición tendrá éxito.
    // Si no, fallará con un 401 y sabremos que no hay sesión.
    const verifyUserSession = async () => {
      try {
        console.log("Verificando sesión existente...");
        const response = await api.get('/auth/profile'); // Llama a una ruta protegida
        console.log("Sesión válida, usuario:", response.data);
        setUser(response.data); // El backend nos devuelve los datos del usuario
      } catch (error) {
        console.log("No hay sesión activa o el token expiró.", error.response?.data?.message);
        setUser(null); // Nos aseguramos de que no haya un usuario en el estado
      } finally {
        setLoading(false); // Terminamos de cargar
      }
    };

    verifyUserSession();
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente


  // --- FUNCIÓN DE LOGOUT ACTUALIZADA ---
  const logout = useCallback(async () => {
    console.log('[AuthProvider] Iniciando cierre de sesión...');
    try {
      // 1. Llama al endpoint del backend para que invalide la cookie
      await api.post('/auth/logout');
      console.log('[AuthProvider] Cookie invalidada en el servidor.');
    } catch (error) {
      console.error('Error durante el logout en el servidor:', error);
      // Aunque falle, continuamos limpiando el frontend para que el usuario vea que cerró sesión.
    } finally {
      // 2. Limpia el estado del usuario en la aplicación
      setUser(null);
      // 3. Redirige al usuario a la página de login
      navigate("/login", { replace: true });
      console.log('[AuthProvider] Sesión cerrada en el frontend.');
    }
  }, [navigate]);
  
  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    logout
  }), [user, loading, logout]);
  

  // No renderizamos nada hasta que terminemos de verificar si hay un token
 if (loading) {
    // Puedes poner un spinner de carga más elaborado aquí
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Cargando sesión...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};