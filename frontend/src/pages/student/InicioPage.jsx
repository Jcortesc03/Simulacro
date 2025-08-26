// src/pages/student/InicioPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, UserCheck, Clock, ExternalLink } from 'lucide-react';

// Componente para las tarjetas de características
const FeatureCard = ({ icon, title, description, hint, colorClasses, path, isExternal = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isExternal) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col overflow-hidden"
    >
      {/* Gradiente de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex flex-col items-center text-center flex-grow">
        {/* Icono con animación */}
        <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 lg:mb-6 flex-shrink-0 ${colorClasses.bg} group-hover:scale-110 transition-transform duration-300`}>
          {React.cloneElement(icon, { className: `w-8 h-8 lg:w-10 lg:h-10 ${colorClasses.icon}` })}
        </div>

        {/* Título */}
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4 group-hover:text-gray-900 transition-colors">
          {title}
        </h3>

        {/* Descripción */}
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">
          {description}
        </p>
      </div>

      {/* Hint/llamada a la acción */}
      <div className="relative mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-700 flex items-center justify-center gap-2">
          {hint}
          {isExternal && <ExternalLink className="w-4 h-4" />}
        </p>
      </div>
    </div>
  );
};

const InicioPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 lg:px-6 xl:px-8">
        {/* Encabezado Principal */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 lg:px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs lg:text-sm font-medium mb-4 lg:mb-6">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2Z"/>
              <path d="M3.09 15.74L12 22L20.91 15.74L12 9.48L3.09 15.74Z"/>
            </svg>
            Plataforma Educativa Oficial
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 tracking-tight mb-4 lg:mb-6">
            Prepárate para las
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Pruebas Saber Pro
            </span>
          </h1>

          <p className="mt-4 lg:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed px-4 lg:px-0">
            Practica con simulacros oficiales, obtén retroalimentación inmediata y mejora tu rendimiento académico con herramientas diseñadas para tu éxito.
          </p>
        </div>

        {/* Grid de tarjetas - responsive para todos los tamaños */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          <FeatureCard
            icon={<Trophy />}
            title="Resultados Detallados"
            description="Analiza tu rendimiento académico y identifica áreas específicas de mejora después de completar los simulacros. Obtén reportes personalizados con estadísticas avanzadas."
            hint="Ir a PRUEBAS"
            colorClasses={{ bg: 'bg-emerald-100', icon: 'text-emerald-600' }}
            path="/student/pruebas"
          />

          <FeatureCard
            icon={<UserCheck />}
            title="Seguimiento Personal"
            description="Accede al historial completo de todos tus simulacros realizados. Visualiza tu progreso a través del tiempo y compara resultados entre diferentes intentos."
            hint="Ir a CALIFICACIONES"
            colorClasses={{ bg: 'bg-violet-100', icon: 'text-violet-600' }}
            path="/student/calificaciones"
          />

          <FeatureCard
            icon={<Clock />}
            title="Simulacros Cronometrados"
            description="Practica en condiciones reales de evaluación con tiempo limitado. Desarrolla estrategias efectivas de gestión del tiempo durante el examen."
            hint="Disponible en PRUEBAS"
            colorClasses={{ bg: 'bg-sky-100', icon: 'text-sky-600' }}
            path="/student/pruebas"
          />

          <FeatureCard
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z"/>
                <circle cx="12" cy="6.5" r="1.5"/>
              </svg>
            }
            title="Portal Oficial ICFES"
            description="Accede al sitio web oficial del Instituto Colombiano para la Evaluación de la Educación. Consulta información institucional, fechas de inscripción y recursos adicionales."
            hint="Visitar ICFES.GOV.CO"
            colorClasses={{ bg: 'bg-amber-100', icon: 'text-amber-700' }}
            path="https://www.icfes.gov.co/"
            isExternal={true}
          />
        </div>

        
      </div>
    </div>
  );
};

export default InicioPage;
