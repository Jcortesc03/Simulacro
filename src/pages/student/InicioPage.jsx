// src/pages/student/InicioPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, UserCheck, Clock } from 'lucide-react';

// Componente para las tarjetas de características (sin cambios en su lógica)
const FeatureCard = ({ icon, title, description, hint, colorClasses, path }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col" // Añadido h-full y flex
    >
      <div className="flex flex-col items-center text-center flex-grow"> {/* Añadido flex-grow */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 flex-shrink-0 ${colorClasses.bg}`}>
          {React.cloneElement(icon, { className: `w-8 h-8 ${colorClasses.icon}` })}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-500 mt-2 flex-grow">{description}</p> {/* Añadido flex-grow */}
      </div>
      <p className="text-sm text-pink-500 mt-4 font-medium text-center">{hint}</p>
    </div>
  );
};

const InicioPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4"> {/* Aumentado el ancho máximo */}
      {/* Encabezado Principal */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Prepárate para las pruebas Saber Pro
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          Practica con simulacros, obtén retroalimentación inmediata y mejora tu rendimiento.
        </p>
      </div>

      {/* --- CAMBIO CLAVE --- 
          Contenedor de las tarjetas de características ahora en un grid de 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Trophy />}
          title="Resultados Detallados"
          description="Analiza tu rendimiento y áreas de mejora, después de realizar algún simulacro."
          hint="(Ir a PRUEBAS)"
          colorClasses={{ bg: 'bg-green-100', icon: 'text-green-600' }}
          path="/student/pruebas"
        />
        <FeatureCard
          icon={<UserCheck />}
          title="Seguimiento Personal"
          description="Historial completo de tus simulacros."
          hint="(Ir a CALIFICACIONES)"
          colorClasses={{ bg: 'bg-purple-100', icon: 'text-purple-600' }}
          path="/student/calificaciones"
        />
        <FeatureCard
          icon={<Clock />}
          title="Simulacros Cronometrados"
          description="Practica en condiciones reales con tiempo limitado."
          hint="(disponible en PRUEBAS)"
          colorClasses={{ bg: 'bg-blue-100', icon: 'text-blue-600' }}
          path="/student/pruebas"
        />
      </div>
    </div>
  );
};

export default InicioPage;