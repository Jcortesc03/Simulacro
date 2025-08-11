import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Home, Users, FileText, LayoutGrid, LogOut, UserCircle } from 'lucide-react';

// Sin cambios en tus datos de usuario
const user = {
  fullName: "USUARIO",
  role: "ADMINISTRADOR",
};

// Componente NavItem con el arreglo de padding
const NavItem = ({ to, icon, children }) => {
  // Sin cambios en tus clases, solo se ajusta el padding
  const baseClasses = "flex flex-auto items-center w-full py-4 text-lg font-medium text-white transition-colors border-b-3 border-blue-800 md:px-4 justify-center md:justify-start";
  const linkClasses = ({ isActive }) => 
    `${baseClasses} ${isActive ? 'bg-blue-800' : 'bg-sidebar-item hover:bg-sidebar-item-hover'}`;

  return (
    <NavLink to={to} className={linkClasses}>
      {icon}
      <span className="ml-4 hidden md:inline">{children}</span>
    </NavLink>
  );
};


const Sidebar = () => {
  const { t } = useTranslation(); 

  return (
    <aside className="flex flex-col w-24 md:w-72 h-screen bg-blue-950 text-white shadow-2xl transition-all duration-300 ease-in-out flex-shrink-0">
      
      {/* 1. Sección del Logo */}
      <div className="flex flex-col items-center justify-center h-40 border-b-2 border-sidebar-item px-2">
        <img src="../../../public/logo-universidad.png.png" alt="Logo Universitaria de Colombia" className="h-12 md:h-20" />
        <p className="text-gray-300 text-sm mt-2 text-center hidden md:block">Pasión por Triunfar</p>
      </div>
      
      {/* 2. Sección del Perfil de Usuario */}
      {/* CAMBIO CLAVE: Padding horizontal (px) solo en desktop */}
      <NavLink to="/perfil" className={({isActive}) => `flex items-center h-24 border-b-2 border-sidebar-bg transition-colors justify-center md:px-4 md:justify-start ${isActive ? 'bg-blue-800' : 'bg-sidebar-item hover:bg-sidebar-item-hover'}`}>
        {/* CAMBIO CLAVE: Icono con tamaño responsive */}
        <UserCircle className="w-10 h-10 md:w-14 md:h-14 text-white flex-shrink-0" />
        <div className="ml-3 hidden md:block overflow-hidden">
          <p className="font-bold text-lg leading-tight truncate">{user.fullName.toUpperCase()}</p>
          <p className="text-sm text-gray-300 truncate">{user.role}</p>
        </div>
      </NavLink>

      {/* 3. Navegación Principal */}
      <nav className="flex-1 flex flex-col pt-2">
        {/* CAMBIO CLAVE: Iconos con tamaño responsive usando clases en lugar de prop 'size' */}
       <NavItem to="/dashboard" icon={<Home className="w-7 h-7 md:w-8 md:h-8" />}>{t('sidebar.home')}</NavItem>
        <NavItem to="/users" icon={<Users className="w-7 h-7 md:w-8 md:h-8" />}>{t('sidebar.users')}</NavItem>
        <NavItem to="/simulacros" icon={<FileText className="w-7 h-7 md:w-8 md:h-8" />}>{t('sidebar.simulations')}</NavItem>
        <NavItem to="/categories" icon={<LayoutGrid className="w-7 h-7 md:w-8 md:h-8" />}>{t('sidebar.categories')}</NavItem>
      </nav>

      {/* 4. Botón de Logout */}
      <div className="flex justify-center items-center p-4">
        {/* CAMBIO CLAVE: El botón ajusta su tamaño y padding para ser un cuadrado en móvil */}
        <button className="flex items-center justify-center h-14 bg-red-500 text-white rounded-2xl hover:bg-red-700 transition-colors w-14 md:w-full md:py-3">
          {/* CAMBIO CLAVE: Icono con tamaño responsive */}
          <LogOut className="w-7 h-7 md:w-8 md:h-8 md:mr-3" />
          <span className="hidden md:block text-lg font-medium">{t('sidebar.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;