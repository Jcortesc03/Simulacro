// src/components/layout/StudentSidebar.jsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Añadimos useNavigate
import { Home, ClipboardList, GraduationCap, LogOut, UserCircle, ShieldAlert } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const studentUser = {
  fullName: "ESTUDIANTE",
  role: "Estudiante",
};

const NavItem = ({ to, icon, children, onClick }) => {
  const baseClasses = "flex items-center w-full py-4 text-lg font-medium text-white transition-colors md:px-4 justify-center md:justify-start";
  const linkClasses = ({ isActive }) => 
    `${baseClasses} ${isActive ? 'bg-blue-800' : 'hover:bg-blue-800'}`;
  return (
    <NavLink to={to} className={linkClasses} onClick={onClick}>
      {icon}
      <span className="ml-4 hidden md:inline">{children}</span>
    </NavLink>
  );
};

const StudentSidebar = () => {
  const navigate = useNavigate(); // Hook para la navegación
  const { isSimulating } = useSimulation();
  const [showBlockAlert, setShowBlockAlert] = useState(false);

  // --- ¡AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA! ---
  const handleProtectedLinkClick = (e) => {
    if (isSimulating) {
      e.preventDefault();
      setShowBlockAlert(true);
    }
  };

  const handleLogout = (e) => {
    // Primero, verificamos si estamos en un simulacro
    if (isSimulating) {
      e.preventDefault();
      setShowBlockAlert(true);
    } else {
      // Si no, cerramos sesión
      console.log("Cerrando sesión de Estudiante...");
      navigate('/login');
    }
  };

  return (
    <>
      <aside className="sticky top-0 flex flex-col w-24 md:w-72 h-screen bg-blue-950 text-white shadow-2xl transition-all duration-300 ease-in-out flex-shrink-0">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center h-40 border-b-2 border-blue-900 px-2 flex-shrink-0">
            <img src="/logo-universidad.png.png" alt="Logo Universitaria de Colombia" className="h-12 md:h-20" />
            <p className="text-gray-300 text-sm mt-2 text-center hidden md:block">Pasión por Triunfar</p>
          </div>
          
          {/* Perfil de Estudiante */}
          <NavLink to="/student/perfil" onClick={handleProtectedLinkClick} className={({isActive}) => `flex items-center h-24 border-b-2 border-blue-900 transition-colors justify-center md:px-4 md:justify-start flex-shrink-0 ${isActive ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
            <UserCircle className="w-10 h-10 md:w-14 md:h-14 text-white flex-shrink-0" />
            <div className="ml-3 hidden md:block overflow-hidden">
              <p className="font-bold text-lg leading-tight truncate">{studentUser.fullName.toUpperCase()}</p>
              <p className="text-sm text-gray-300 truncate">{studentUser.role}</p>
            </div>
          </NavLink>

          {/* Navegación Principal */}
          <nav className="flex-1 flex flex-col pt-2">
            <NavItem to="/student/inicio" onClick={handleProtectedLinkClick} icon={<Home className="w-7 h-7 md:w-8 md:h-8" />}>INICIO</NavItem>
            <NavItem to="/student/pruebas" onClick={handleProtectedLinkClick} icon={<ClipboardList className="w-7 h-7 md:w-8 md:h-8" />}>PRUEBAS</NavItem>
            <NavItem to="/student/calificaciones" onClick={handleProtectedLinkClick} icon={<GraduationCap className="w-7 h-7 md:w-8 md:h-8" />}>CALIFICACIONES</NavItem>
          </nav>
        </div>

        {/* Botón de Logout */}
        <div className="flex justify-center items-center p-4 border-t-2 border-blue-900 flex-shrink-0">
          <button onClick={handleLogout} className="flex items-center justify-center h-14 bg-red-500 text-white rounded-2xl hover:bg-red-700 transition-colors w-14 md:w-full md:py-3">
            <LogOut className="w-7 h-7 md:w-8 md:h-8 md:mr-3" />
            <span className="hidden md:block text-lg font-medium">Salir</span>
          </button>
        </div>
      </aside>

      {/* Modal de Alerta */}
      {showBlockAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-sm mx-4 animate-fade-in-up">
            <ShieldAlert className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <h3 className="font-bold text-xl text-gray-800 mb-2">Prueba en Progreso</h3>
            <p className="text-gray-600 mb-6">No puedes navegar a otras secciones hasta que finalices el simulacro actual.</p>
            <button 
              onClick={() => setShowBlockAlert(false)} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentSidebar;