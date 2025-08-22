// src/components/layout/TeacherLayout.jsx

import TeacherSidebar from './TeacherSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import React from 'react';

// Función para obtener el título dinámicamente
const getTitleFromPathname = (pathname) => {
  const lastSegment = pathname.split('/').filter(Boolean).pop() || 'simulacros';
  const titleMap = {
    'simulacros': 'Resultados de Simulacros',
    'categories': 'Gestión de Categorías',
    'perfil': 'Mi Perfil'
  };
   // Caso especial para el detalle de categoría
  if (pathname.includes('/teacher/categories/') && lastSegment !== 'categories') {
    return 'Detalle de Categoría';
  }
  for (const key in titleMap) {
    if (lastSegment.startsWith(key)) return titleMap[key];
  }
  return 'Panel de Profesor';
};

const TeacherLayout = () => {
  const location = useLocation();
  const title = getTitleFromPathname(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;