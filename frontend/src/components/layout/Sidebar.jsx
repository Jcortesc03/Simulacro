import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  Users,
  FileText,
  LayoutGrid,
  LogOut,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import { logo } from "../../assets/backgraund-login/index";
import api from "../../api/axiosInstance"; // tu cliente Axios configurado

const NavItem = ({ to, icon, children, isCollapsed }) => {
  const baseClasses =
    "flex items-center w-full py-3 px-4 text-base font-medium text-white transition-all duration-300 hover:bg-blue-800/70 rounded-lg mx-2";

  const linkClasses = ({ isActive }) =>
    `${baseClasses} ${isActive ? "bg-blue-800 shadow-lg" : ""}`;

  return (
    <NavLink to={to} className={linkClasses}>
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

const AdminSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState({ fullName: "", role: "" });

  // 🔹 Cargar datos del perfil desde el backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUser({
            fullName: response.data.name || "Usuario",
            role: response.data.role || "Rol",
          });
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
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
            to="/admin/perfil"
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
                  {user.fullName}
                </p>
                <p className="text-xs text-blue-300 truncate">Administrador</p>
              </div>
            )}
          </NavLink>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2 px-2">
          <NavItem
            to="/admin/dashboard"
            icon={<Home className="w-5 h-5" />}
            isCollapsed={isCollapsed}
          >
            {t("Home")}
          </NavItem>
          <NavItem
            to="/admin/users"
            icon={<Users className="w-5 h-5" />}
            isCollapsed={isCollapsed}
          >
            {t("Usuarios")}
          </NavItem>
          <NavItem
            to="/admin/simulacros"
            icon={<FileText className="w-5 h-5" />}
            isCollapsed={isCollapsed}
          >
            {t("Simulaciones")}
          </NavItem>
          <NavItem
            to="/admin/categories"
            icon={<LayoutGrid className="w-5 h-5" />}
            isCollapsed={isCollapsed}
          >
            {t("Categorias")}
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
            <span className="ml-3 font-medium">{t("Salir")}</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
