// src/components/simulation/QuestionResult.jsx

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const QuestionResult = ({ question, questionNumber, userAnswer, correctAnswer }) => {
  // Manejo de seguridad en caso de que alguna prop no llegue
  const isCorrect = userAnswer?.selectedOption === correctAnswer?.optionId;

  const renderOptionContent = (text) => {
    if (text && text.trim().startsWith('<img')) {
      return <div className="max-w-xs" dangerouslySetInnerHTML={{ __html: text }} />;
    }
    return text || 'No respondida';
  };

  return (
    <div className="p-4 border-b border-gray-200 last:border-b-0">
      {/* --- SECCIÓN DE LA PREGUNTA --- */}
      <div className="flex items-start gap-4 mb-4">
        {/* Ícono de Correcto/Incorrecto */}
        {isCorrect ? (
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
        )}
        {/* Enunciado y Contexto de la Pregunta */}
        <div className="flex-grow">
          <p className="font-semibold text-gray-800">
            Pregunta {questionNumber}:
          </p>
          {/* Mostramos el texto del enunciado */}
          <p className="mt-1 text-gray-700">{question?.statement}</p>
          {/* Mostramos la imagen de la pregunta si existe */}
          {question?.image_path && (
            <div className="mt-4 p-2 border rounded-lg bg-gray-50 inline-block">
              <img src={question.image_path} alt={`Contexto para la pregunta ${questionNumber}`} className="max-w-full h-auto rounded-md" />
            </div>
          )}
        </div>
      </div>
      
      {/* --- SECCIÓN DE LAS RESPUESTAS --- */}
      <div className="ml-10 pl-1 border-l-2 border-gray-200 space-y-3">
        <div className="text-sm text-gray-600">
          <span className="font-bold">Tu respuesta: </span> 
          <span>{renderOptionContent(userAnswer?.optionText)}</span>
        </div>
        {!isCorrect && (
          <div className="text-sm text-green-700">
            <span className="font-bold">Respuesta correcta: </span>
            <span className="font-semibold">{renderOptionContent(correctAnswer?.optionText)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionResult;