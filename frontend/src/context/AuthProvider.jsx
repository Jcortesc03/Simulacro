// context/AuthProvider.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { AuthContext } from "./AuthContext.jsx";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosInstance.jsx";
import { useNavigate } from "react-router-dom"; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber si estamos verificando el token
    const navigate = useNavigate(); 

  useEffect(() => {
    // Esta función se ejecuta solo una vez, cuando la aplicación carga.
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Validar si el token ha expirado (opcional pero recomendado)
        if (decodedUser.exp * 1000 > Date.now()) {
          // Si el token es válido, actualizamos el estado del usuario y Axios
          setUser({
            id: decodedUser.id,
            name: decodedUser.name,
            email: decodedUser.email,
            role: decodedUser.role,
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Si el token expiró, lo limpiamos
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // Terminamos de cargar
  }, []);



  // Creamos una función de logout para limpiar todo
  const logout = useCallback(() => {
      console.log('[AuthProvider] Iniciando cierre de sesión...');
    
    // 1. Limpia el estado del usuario en la aplicación
    console.log('[AuthProvider] Estableciendo usuario a null.');
    setUser(null);
    
    // 2. Elimina el token del almacenamiento del navegador
    console.log('[AuthProvider] Borrando token de localStorage.');
    localStorage.removeItem("token");
    
    // 3. Elimina el encabezado de autorización de futuras peticiones
    console.log('[AuthProvider] Borrando cabecera de Axios.');
    delete api.defaults.headers.common['Authorization'];
    
    // 4. Redirige al usuario a la página de login
    console.log('[AuthProvider] Redirigiendo a /login.');
    navigate("/login", { replace: true });
    // --- FIN DE LA DEPURACIÓN DE LOGOUT ---
  }, [navigate]);
  
  // Usamos useMemo para evitar que el valor del contexto se recalcule innecesariamente
  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    logout
  }), [user, loading, logout]);

  // No renderizamos nada hasta que terminemos de verificar si hay un token
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};