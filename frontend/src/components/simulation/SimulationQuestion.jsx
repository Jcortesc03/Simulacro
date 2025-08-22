// src/components/simulation/QuestionCard.jsx

import React from 'react';
import Card from '../ui/Card';

const SimulationQuestion= ({ question, questionNumber, selectedAnswer, onSelectAnswer }) => {
  
  // Función para renderizar las opciones, ya sean texto o HTML (imágenes)
  const renderOptionContent = (text) => {
    if (text.trim().startsWith('<img')) {
      // Importante: Esto asume que el HTML en tu BD es seguro.
      return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }
    return text;
  };

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Pregunta {questionNumber}: {question.statement}
      </h2>

      {/* Renderizado condicional de la imagen de la pregunta */}
      {question.image_path && (
        <div className="my-4 flex justify-center">
          <img src={question.image_path} alt={`Contexto para la pregunta ${questionNumber}`} className="max-w-full h-auto rounded-lg border" />
        </div>
      )}

      {/* Opciones de respuesta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map(option => {
          const isSelected = selectedAnswer === option.option_id;
          const baseClasses = "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200";
          const selectedClasses = "bg-blue-500 border-blue-700 text-white font-bold";
          const unselectedClasses = "bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-300";

          return (
            <div
              key={option.option_id}
              onClick={() => onSelectAnswer(question.question_id, option.option_id)}
              className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
            >
              <span className="font-bold mr-2">{option.label})</span>
              {renderOptionContent(option.option_text)}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SimulationQuestion;