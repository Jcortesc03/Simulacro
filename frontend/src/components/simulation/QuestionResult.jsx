// src/components/simulation/QuestionResult.jsx

import React from 'react';
import { CheckCircle2, XCircle, MessageSquareText } from 'lucide-react';

const QuestionResult = ({ question, questionNumber, userAnswer, correctAnswer, feedback }) => {
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
        {isCorrect ? (
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
        )}
        <div className="flex-grow">
          <p className="font-semibold text-gray-800">
            Pregunta {questionNumber}:
          </p>
          <p className="mt-1 text-gray-700">{question?.statement}</p>
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

      {/* --- SECCIÓN DE RETROALIMENTACIÓN --- */}
      {feedback && (
        <div className="ml-10 mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <MessageSquareText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <h4 className="font-semibold text-sm text-blue-800">Retroalimentación de la IA</h4>
              <p className="text-sm text-gray-700 mt-1">{feedback}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionResult;
