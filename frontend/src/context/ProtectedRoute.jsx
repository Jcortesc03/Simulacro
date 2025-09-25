// context/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const roleMap = {
  '1': 'student',
  '2': 'teacher',
  '3': 'admin'
};


export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, Logout} = useAuth();
  //consolelog para mostrar 
    // console.log('[ProtectedRoute] Verificando acceso. Usuario:', user, 'Cargando:', loading);

   if (loading) {
    return <div>Verificando sesión...</div>; 
  }
    if (!user) {
   // console.log('[ProtectedRoute] Acceso denegado: No hay usuario. Redirigiendo a /login.');
    return <Navigate to="/login" replace />;
  }

    const userRoleName = roleMap[user.role];

 
  if (allowedRoles && !allowedRoles.includes(userRoleName)) {
   // console.log(`[ProtectedRoute] Acceso denegado: Rol '${userRoleName}' no permitido. Redirigiendo a /unauthorized.`);
    return <Navigate to="/unauthorized" replace />;
  }
    //console.log('[ProtectedRoute] Acceso permitido.');

  return children;
}
