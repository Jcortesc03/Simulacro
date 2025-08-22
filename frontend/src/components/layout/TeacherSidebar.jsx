// src/components/layout/TeacherSidebar.jsx

import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, LayoutGrid, LogOut, UserCircle } from 'lucide-react';

const teacherUser = {
  fullName: "PROFESOR",
  role: "Profesor",
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

const TeacherSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className="sticky top-0 flex flex-col w-24 md:w-72 h-screen bg-blue-950 text-white shadow-2xl transition-all duration-300 ease-in-out flex-shrink-0">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-40 border-b-2 border-blue-900 px-2">
          <img src="/logo-universidad.png.png" alt="Logo" className="h-12 md:h-20" />
          <p className="text-gray-300 text-sm mt-2 text-center hidden md:block">Pasión por Triunfar</p>
        </div>
        <NavLink to="/teacher/perfil" className={({isActive}) => `flex items-center h-24 border-b-2 border-blue-900 transition-colors justify-center md:px-4 md:justify-start ${isActive ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
          <UserCircle className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0" />
          <div className="ml-3 hidden md:block overflow-hidden">
            <p className="font-bold text-lg leading-tight truncate">{teacherUser.fullName.toUpperCase()}</p>
            <p className="text-sm text-gray-300 truncate">{teacherUser.role}</p>
          </div>
        </NavLink>
        <nav className="flex-1 flex flex-col pt-2">
          <NavItem to="/teacher/simulacros" icon={<FileText className="w-7 h-7 md:w-8 md:h-8" />}>SIMULACROS</NavItem>
          <NavItem to="/teacher/categories" icon={<LayoutGrid className="w-7 h-7 md:w-8 md:h-8" />}>CATEGORÍAS</NavItem>
        </nav>
      </div>
      <div className="p-4 border-t-2 border-blue-900">
        <button onClick={handleLogout} className="flex items-center justify-center h-14 bg-red-500 text-white rounded-2xl hover:bg-red-700 transition-colors w-14 md:w-full md:py-3">
          <LogOut className="w-7 h-7 md:w-8 md:h-8 md:mr-3" />
          <span className="hidden md:block text-lg font-medium">Salir</span>
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;