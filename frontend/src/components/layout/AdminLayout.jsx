// src/components/layout/AdminLayout.jsx

import Sidebar from './Sidebar'; // Importa el Sidebar de Admin
import { Outlet, useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance';
import React from 'react';

// Función para obtener el título dinámicamente de la URL
const getTitleFromPathname = (pathname) => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  const titleMap = {
    'dashboard': 'Inicio',
    'users': 'Usuarios',
    'simulacros': 'Simulacros',
    'categories': 'Categorías',
    'perfil': 'Mi Perfil',
    'add': 'Añadir Usuario',
    'edit': 'Editar Usuario'
  };

  // Maneja el caso de detalle de categoría
  if (pathSegments.includes('categories') && lastSegment !== 'categories') {
    return 'Detalle de Categoría';
  }
  // Maneja el caso de formulario de preguntas
  if (pathSegments.includes('questions')) {
    return isNaN(parseInt(lastSegment)) ? 'Añadir Pregunta' : 'Editar Pregunta';
  }

  for (const key in titleMap) {
    if (lastSegment.startsWith(key)) {
      return titleMap[key];
    }
  }

  return 'Administración'; // Título por defecto
};


const AdminLayout = () => {
  const location = useLocation();
  const title = getTitleFromPathname(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
