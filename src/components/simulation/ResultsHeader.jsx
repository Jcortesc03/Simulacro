// src/components/simulation/ResultsHeader.jsx

import React from 'react';
import Card from '../ui/Card';

const ResultsHeader = ({ feedback, time, score }) => {
  return (
    <Card className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
      {/* Sección de Retroalimentación */}
      <div className="flex-1 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Retroalimentación</h2>
        <p className="text-gray-600">
          {feedback}
        </p>
      </div>
      
      {/* Sección de Tiempo y Puntaje */}
      <div className="flex">
        <div className="w-1/2 md:w-auto p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Tiempo</h3>
          <p className="text-3xl font-bold text-gray-800">{time}</p>
        </div>
        <div className="w-1/2 md:w-auto p-4 text-center border-l border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Puntaje Final</h3>
          <p className="text-3xl font-bold text-blue-600">{score}</p>
        </div>
      </div>
    </Card>
  );
};

export default ResultsHeader;