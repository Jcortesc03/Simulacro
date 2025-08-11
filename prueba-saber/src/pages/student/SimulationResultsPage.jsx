// src/pages/student/SimulationResultsPage.jsx

import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import QuestionResult from '../../components/simulation/QuestionResult';
import PerformanceMeter from '../../components/simulation/PerformanceMeter';

// --- ¡NUEVO! --- Header de Resultados ahora es un componente local y simple
const ResultsHeader = ({ feedback, time, score, level }) => {
  return (
    <Card className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
      <div className="flex-1 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Retroalimentación General</h2>
        <p className="text-gray-600">{feedback}</p>
      </div>
      <div className="flex">
        <div className="w-1/2 md:w-auto p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Tiempo</h3>
          <p className="text-3xl font-bold text-gray-800">{time}</p>
        </div>
        <div className="w-1/2 md:w-auto p-4 text-center border-l border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Puntaje Final</h3>
          <p className="text-3xl font-bold text-blue-600">{score}</p>
          <span className={`mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800`}>{level}</span>
        </div>
      </div>
    </Card>
  );
};


const SimulationResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { attemptId } = useParams();

  // Obtenemos los resultados directamente del estado de la navegación.
  // Ya no usamos mock data aquí.
  const results = location.state?.results;
  const returnPath = location.state?.from || '/student/pruebas';
  const returnButtonText = returnPath === '/student/calificaciones' 
    ? 'Volver a Calificaciones' 
    : 'Volver a Pruebas';
  // Si por alguna razón no hay resultados, mostramos un mensaje y un botón para volver.
  if (!results) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">No se encontraron los resultados</h1>
        <p className="mb-6">Parece que hubo un problema al cargar los resultados de tu prueba.</p>
        <Button onClick={() => navigate('/student/pruebas')}>Volver a Pruebas</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Resultados: {results.examName}</h1>
      
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
              question={q} // Pasamos el objeto de pregunta completo
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