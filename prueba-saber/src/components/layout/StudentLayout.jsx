// src/components/layout/StudentLayout.jsx

import StudentSidebar from './StudentSidebar'; // Asegúrate de que importe el sidebar de ESTUDIANTE
import { Outlet } from "react-router-dom";

const StudentLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar /> {/* Usa el componente StudentSidebar */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        {title && (
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
          </header>
        )}
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default StudentLayout;