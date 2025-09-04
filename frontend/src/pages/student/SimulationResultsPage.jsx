// En src/pages/student/SimulationResultsPage.jsx

import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import QuestionResult from '../../components/simulation/QuestionResult';
import PerformanceMeter from '../../components/simulation/PerformanceMeter';

// --- COMPONENTE 1: LA SECCIÓN DE FEEDBACK EXPANDIBLE (tomado de SimulationPage.jsx) ---
const FeedbackSection = ({ feedback }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getShortFeedback = (text) => {
    if (!text) return "No hay retroalimentación disponible.";
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    return sentences.length > 2 ? sentences.slice(0, 2).join('.') + '.' : text;
  };

  const shortFeedback = getShortFeedback(feedback);
  const shouldShowExpandButton = feedback && feedback.length > shortFeedback.length;

  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-800">Retroalimentación Personalizada</h2>
        {shouldShowExpandButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {isExpanded ? 'Mostrar menos' : 'Ver completa'}
          </button>
        )}
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {isExpanded ? feedback : shortFeedback}
        </p>
      </div>
       {shouldShowExpandButton && !isExpanded && (
        <p className="text-xs text-gray-500 mt-2 italic">
            Haz clic en "Ver completa" para leer el análisis completo de la IA.
        </p>
      )}
    </div>
  );
};

// --- COMPONENTE 2: EL HEADER DE RESULTADOS MEJORADO ---
const ResultsHeader = ({ feedback, time, score, level }) => (
  <Card className="overflow-hidden">
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FeedbackSection feedback={feedback} />
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 border rounded-xl p-4 text-center">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Tiempo Utilizado</h3>
            <p className="text-2xl font-bold text-gray-800">{time}</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <h3 className="text-sm font-semibold text-blue-600 uppercase">Puntaje Final</h3>
            <p className="text-3xl font-bold text-blue-700">{score}</p>
            <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              {level}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

// --- COMPONENTE PRINCIPAL (Tu SimulationResultsPage, ahora usando los componentes mejorados) ---
const SimulationResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const results = location.state?.results;
  const returnPath = location.state?.from || '/student/pruebas';
  const returnButtonText = returnPath === '/student/calificaciones' 
    ? 'Volver a Calificaciones' 
    : 'Volver a Pruebas';

  if (!results) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">No se encontraron los resultados</h1>
        <p className="mb-6">Parece que hubo un problema al cargar los resultados de tu prueba.</p>
        <Button onClick={() => navigate('/student/pruebas')}>Volver a Pruebas</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Resultados de Evaluación</h1>
        <p className="text-xl text-gray-600 mt-1">{results.examName}</p>
      </div>
      
      <ResultsHeader 
        feedback={results.generalFeedback}
        time={results.timeTaken}
        score={Math.round(results.finalScore)}
        level={results.level}
      />
 
      <PerformanceMeter 
        score={results.finalScore}
        level={results.level}
      />

      <Card>
        <h2 className="text-xl font-bold text-gray-800 p-4 border-b">Revisión de Preguntas</h2>
        <div className="divide-y divide-gray-200">
          {results.questions.map((q, index) => (
            <QuestionResult 
              key={q.question_id}
              questionNumber={index + 1}
              question={q}
              userAnswer={q.user_answer}
              correctAnswer={q.correct_answer}
            />
          ))}
        </div>
      </Card>
      
      <div className="text-center">
        <Button 
          onClick={() => navigate(returnPath)} 
          variant='primary' 
          className="bg-slate-600 hover:bg-slate-800"
        >
          {returnButtonText}
        </Button>
      </div>
    </div>
  );
};

export default SimulationResultsPage;