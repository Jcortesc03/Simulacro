import { Navigate } from 'react-router-dom';

// Simulación del estado de autenticación.
// En una app real, esto vendría de un Context, Redux, o un custom hook.
const useAuth = () => {
  // Para probar, puedes cambiar este objeto manualmente:
  // - user: null -> no ha iniciado sesión
  // - user: { role: 'admin' } -> es admin
  // - user: { role: 'maestro' } -> es maestro
  const user = { role: 'admin' }; // SIMULACIÓN: Usuario admin logueado

  return { isAuthenticated: !!user, userRole: user?.role };
};


const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  // 1. Si el usuario no está autenticado, lo redirigimos al login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta requiere roles específicos y el usuario no tiene el rol permitido,
  //    lo redirigimos a una página de "no autorizado" o al inicio de su propio dashboard.
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />; // O a una ruta por defecto
  }
  
  // 3. Si todo está en orden, mostramos el componente de la ruta.
  return children;
};

export default ProtectedRoute;