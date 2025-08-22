// src/components/simulation/PerformanceMeter.jsx

import React from 'react';
// --- ¡CAMBIO! --- Añadimos el ícono 'Laugh'
import { Laugh, Smile, Meh, Frown } from 'lucide-react';

const PerformanceMeter = ({ score, level }) => {
  const cappedScore = Math.min(score, 300);
  const scorePercentage = (cappedScore / 300) * 100;

  // --- ¡NUEVOS ÍCONOS! ---
  const levels = [
    { name: 'Nivel 1', range: '0-144', color: 'bg-red-500', icon: <Frown /> },
    { name: 'Nivel 2', range: '145-164', color: 'bg-yellow-500', icon: <Meh /> },
    { name: 'Nivel 3', range: '165-220', color: 'bg-blue-500', icon: <Smile /> },
    { name: 'Nivel 4', range: '221-300', color: 'bg-green-500', icon: <Laugh /> }, // El nuevo ícono =D
  ];
  
  const currentLevelInfo = levels.find(l => l.name === level) || levels[0];

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md border">
      <h3 className="text-md font-semibold text-gray-700 mb-4 text-center">Escala de Desempeño (0 - 300)</h3>
      
      {/* Barra de Progreso y Marcador (sin cambios en la estructura) */}
      <div className="relative w-full pt-8 px-4">
        <div className="relative h-4 bg-gray-200 rounded-full">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full ${currentLevelInfo.color} transition-all duration-1000 ease-out`}
            style={{ width: `${scorePercentage}%` }}
          ></div>
          <div 
            className="absolute top-0 h-full flex flex-col items-center" 
            style={{ left: `${scorePercentage}%` }}
          >
            <div className="absolute -translate-x-1/2 bottom-5">
              <span className="text-sm font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md shadow-sm border">{Math.round(score)}</span>
              <div className="h-2 w-0.5 bg-gray-400 mx-auto mt-1"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda de Niveles (con los nuevos íconos) */}
      <div className="grid grid-cols-4 mt-2 text-center text-xs text-gray-500">
        {levels.map((lvl) => {
          const isActive = lvl.name === level;
          return (
            <div 
              key={lvl.name} 
              className={`p-2 rounded-lg transition-all duration-300 ${isActive ? `${lvl.color} text-white shadow-lg` : 'opacity-60'}`}
            >
              <div className={`mx-auto w-6 h-6 mb-1`}>{lvl.icon}</div>
              <p className="font-bold">{lvl.name}</p>
              <p>{lvl.range}</p>
            </div>
          );
        })}
      </div>
      <div className="text-center text-xs text-gray-400 mt-3 border-t pt-2">
        <p><span className="font-semibold">Nivel 2:</span> Alrededor del promedio nacional. <span className="font-semibold">Nivel 3:</span> Desempeño sobresaliente.</p>
      </div>
    </div>
  );
};

export default PerformanceMeter;