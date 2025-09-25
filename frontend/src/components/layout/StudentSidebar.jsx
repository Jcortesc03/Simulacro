import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  ClipboardList,
  GraduationCap,
  LogOut,
  UserCircle,
  ShieldAlert,
  Menu,
  X,
} from "lucide-react";
import { useSimulation } from "../../context/SimulationContext";
import { logo } from "../../assets/backgraund-login/index";
import api from "../../api/axiosInstance"; // 👈 importas tu api
import { useAuth } from "../../context/useAuth";

const NavItem = ({ to, icon, children, onClick, isCollapsed }) => {
  const baseClasses =
    "flex items-center w-full py-3 px-4 text-base font-medium text-white transition-all duration-300 hover:bg-blue-800/70 rounded-lg mx-2";

  const linkClasses = ({ isActive }) =>
    `${baseClasses} ${isActive ? "bg-blue-800 shadow-lg" : ""}`;

  return (
    <NavLink to={to} className={linkClasses} onClick={onClick}>
      <div className="flex items-center justify-center w-8 h-8">{icon}</div>
      <span
        className={`ml-3 transition-all duration-300 ${
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        }`}
      >
        {children}
      </span>
    </NavLink>
  );
};

const StudentSidebar = () => {
  //const navigate = useNavigate();
  const { isSimulating } = useSimulation();
  const [showBlockAlert, setShowBlockAlert] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 👇 estados del usuario
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const {  logout } = useAuth();


  // cargar datos del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("auth/profile");
        if (response.data) {
          setUserName(response.data.name);
          setUserRole(response.data.role);
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleProtectedLinkClick = (e) => {
    if (isSimulating) {
      e.preventDefault();
      setShowBlockAlert(true);
    }
  };

  const handleLogout = (e) => {
    if (isSimulating) {
      e.preventDefault();
      setShowBlockAlert(true);
    } else {
      console.log("Cerrando sesión de Estudiante...");
      logout();
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // función para mostrar nombre del rol
  const getRoleName = (role) => {
    switch (parseInt(role)) {
      case 1:
        return "Estudiante";
      case 2:
        return "Profesor";
      case 3:
        return "Administrador";
      default:
        return "Usuario";
    }
  };

  return (
    <>
      <aside
        className={`sticky top-0 flex flex-col h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white shadow-2xl transition-all duration-300 ease-in-out flex-shrink-0 ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-blue-800/50 transition-colors duration-200"
          >
            {isCollapsed ? (
              <Menu className="w-6 h-6" />
            ) : (
              <X className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Logo Section */}
          <div
            className={`flex flex-col items-center justify-center border-b border-blue-800/50 pb-6 mb-4 transition-all duration-300 ${
              isCollapsed ? "px-2" : "px-6"
            }`}
          >
            <div className="relative">
              <img
                src={logo}
                alt="Logo Universitaria de Colombia"
                className={`transition-all duration-300 ${
                  isCollapsed ? "h-10 w-10" : "h-16 w-auto"
                }`}
              />
            </div>
            {!isCollapsed && (
              <p className="text-blue-200 text-sm mt-3 text-center font-light animate-fade-in">
                Pasión por Triunfar
              </p>
            )}
          </div>

          {/* User Profile */}
          <div
            className={`mb-6 transition-all duration-300 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
          >
            <NavLink
              to="/student/perfil"
              onClick={handleProtectedLinkClick}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-blue-800/50 ${
                  isActive ? "bg-blue-800 shadow-lg" : ""
                } ${isCollapsed ? "justify-center" : ""}`
              }
            >
              <div className="relative">
                <UserCircle className="w-10 h-10 text-blue-200" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-blue-950"></div>
              </div>
              {!isCollapsed && (
                <div className="ml-4 overflow-hidden">
                  <p className="font-semibold text-sm leading-tight truncate">
                    {userName || "Cargando..."}
                  </p>
                  <p className="text-xs text-blue-300 truncate">
                    {getRoleName(userRole)}
                  </p>
                </div>
              )}
            </NavLink>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2 px-2">
            <NavItem
              to="/student/inicio"
              onClick={handleProtectedLinkClick}
              icon={<Home className="w-5 h-5" />}
              isCollapsed={isCollapsed}
            >
              Inicio
            </NavItem>
            <NavItem
              to="/student/pruebas"
              onClick={handleProtectedLinkClick}
              icon={<ClipboardList className="w-5 h-5" />}
              isCollapsed={isCollapsed}
            >
              Pruebas
            </NavItem>
            <NavItem
              to="/student/calificaciones"
              onClick={handleProtectedLinkClick}
              icon={<GraduationCap className="w-5 h-5" />}
              isCollapsed={isCollapsed}
            >
              Calificaciones
            </NavItem>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-800/50 transition-all duration-300">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg ${
              isCollapsed ? "p-3 justify-center" : "p-4"
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && (
              <span className="ml-3 font-medium">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </aside>

      {/* Block Alert Modal */}
      {showBlockAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-md mx-4 animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-3">
              Prueba en Progreso
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              No puedes navegar a otras secciones hasta que finalices el
              simulacro actual.
            </p>
            <button
              onClick={() => setShowBlockAlert(false)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentSidebar;
