// src/components/layout/Sidebar.jsx

import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, FileText, LayoutGrid, LogOut, UserCircle } from 'lucide-react';

const user = {
  fullName: "USUARIO",
  role: "ADMINISTRADOR",
};

const NavItem = ({ to, icon, children }) => {
  const baseClasses = "flex items-center w-full py-4 text-lg font-medium text-white transition-colors md:px-4 justify-center md:justify-start";
  const linkClasses = ({ isActive }) => `${baseClasses} ${isActive ? 'bg-blue-800' : 'hover:bg-blue-800'}`;
  return (
    <NavLink to={to} className={linkClasses}>
      {icon}
      <span className="ml-4 hidden md:inline">{children}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const { t } = useTranslation(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí iría la lógica para limpiar tokens o estado de sesión
    console.log("Cerrando sesión de Admin...");
    navigate('/login');
  };

  return (
    <aside className="sticky top-0 flex flex-col w-24 md:w-72 h-screen bg-blue-950 text-white shadow-2xl transition-all duration-300 ease-in-out flex-shrink-0">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* 1. Sección del Logo */}
        <div className="flex flex-col items-center justify-center h-40 border-b-2 border-blue-900 px-2 flex-shrink-0">
          <img src="/logo-universidad.png.png" alt="Logo Universitaria de Colombia" className="h-12 md:h-20" />
          <p className="text-gray-300 text-sm mt-2 text-center hidden md:block">Pasión por Triunfar</p>
        </div>
        
        {/* 2. Sección del Perfil de Usuario */}
        <NavLink to="/admin/perfil" className={({isActive}) => `flex items-center h-24 border-b-2 border-blue-900 transition-colors justify-center md:px-4 md:justify-start flex-shrink-0 ${isActive ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
          <UserCircle className="w-10 h-10 md:w-14 md:h-14 text-white flex-shrink-0" />
          <div className="ml-3 hidden md:block overflow-hidden">
            <p className="font-bold text-lg leading-tight truncate">{user.fullName.toUpperCase()}</p>
            <p className="text-sm text-gray-300 truncate">{user.role}</p>
          </div>
        </NavLink>

        {/* 3. Navegación Principal */}
        <nav className="flex-1 flex flex-col pt-2">
          <NavItem to="/admin/dashboard" icon={<Home className="w-7 h-7 md:w-8 md:h-8" />}>{t('sidebar.home')}</NavItem>
          <NavItem to="/admin/users" icon={<Users className="w-7 h-7 md:w-8 md:h-8" />}>{t('sidebar.users')}</NavItem>
          <NavItem to="/admin/simulacros" icon={<FileText className="w-7 h-7 md:w-8 md:h-8" />}>{t('sidebar.simulations')}</NavItem>
          <NavItem to="/admin/categories" icon={<LayoutGrid className="w-7 h-7 md:w-8 md:h-8" />}>{t('sidebar.categories')}</NavItem>
        </nav>
      </div>

      {/* 4. Botón de Logout */}
      <div className="flex justify-center items-center p-4 border-t-2 border-blue-900 flex-shrink-0">
        <button onClick={handleLogout} className="flex items-center justify-center h-14 bg-red-500 text-white rounded-2xl hover:bg-red-700 transition-colors w-14 md:w-full md:py-3">
          <LogOut className="w-7 h-7 md:w-8 md:h-8 md:mr-3" />
          <span className="hidden md:block text-lg font-medium">{t('sidebar.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;