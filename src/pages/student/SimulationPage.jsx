// src/pages/student/SimulationPage.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Timer from '../../components/simulation/Timer';
import SimulationQuestion from '../../components/simulation/SimulationQuestion';
import Button from '../../components/ui/Button';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import SuccessModal from '../../components/ui/SuccessModal';
import { useSimulation } from '../../context/SimulationContext';

// --- DATOS DE EJEMPLO MEJORADOS ---
const mockQuestions = {
  'lectura-critica': [
    { 
      question_id: 'lc-q1', 
      statement: '¿Cuál es la capital de Francia?', 
      difficulty: 'low',
      options: [ 
        { option_id: 'lc-o1a', label: 'a', option_text: 'Londres', is_correct: false }, 
        { option_id: 'lc-o1b', label: 'b', option_text: 'Madrid', is_correct: false }, 
        { option_id: 'lc-o1c', label: 'c', option_text: 'París', is_correct: true }, 
        { option_id: 'lc-o1d', label: 'd', option_text: 'Roma', is_correct: false } 
      ]
    },
    { 
      question_id: 'lc-q2', 
      statement: '¿Qué se puede inferir del texto?', 
      difficulty: 'medium',
      options: [ 
        { option_id: 'lc-o2a', label: 'a', option_text: 'Opción A', is_correct: false }, 
        { option_id: 'lc-o2b', label: 'b', option_text: 'Opción B', is_correct: true }, 
        { option_id: 'lc-o2c', label: 'c', option_text: 'Opción C', is_correct: false }, 
        { option_id: 'lc-o2d', label: 'd', option_text: 'Opción D', is_correct: false } 
      ]
    }
  ],
};
// ----------------------------

const SimulationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryPath } = useParams();
  const { startSimulation, endSimulation } = useSimulation();

  const examName = location.state?.examName || 'Simulacro';
  const questionCount = location.state?.questionCount || 5;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startSimulation();
    const categoryQuestions = mockQuestions[categoryPath] || []; 
    setQuestions(categoryQuestions.slice(0, questionCount));
    
    return () => endSimulation();
  }, [categoryPath, questionCount, startSimulation, endSimulation]);

  const calculateResults = useCallback(() => {
    let puntajeObtenido = 0;
    let puntajeMaximoPosible = 0;

    questions.forEach(q => {
      const peso = q.difficulty === 'high' ? 3 : q.difficulty === 'medium' ? 2 : 1;
      puntajeMaximoPosible += peso;
      
      const respuestaUsuario = answers[q.question_id];
      const opcionCorrecta = q.options.find(opt => opt.is_correct)?.option_id;

      if (respuestaUsuario === opcionCorrecta) {
        puntajeObtenido += peso;
      }
    });

    const puntajeFinal = puntajeMaximoPosible > 0 ? Math.round((puntajeObtenido / puntajeMaximoPosible) * 300) : 0;
    
    let nivel;
    if (puntajeFinal >= 221) {
      nivel = 'Nivel 4';
    } else if (puntajeFinal >= 165) {
      nivel = 'Nivel 3';
    } else if (puntajeFinal >= 145) {
      nivel = 'Nivel 2';
    } else {
      nivel = 'Nivel 1';
    }


    const endTime = Date.now();
    const timeTakenInSeconds = Math.round((endTime - startTimeRef.current) / 1000);
    const minutes = Math.floor(timeTakenInSeconds / 60);
    const seconds = timeTakenInSeconds % 60;
    const timeTakenFormatted = `${minutes}m ${seconds}s`;

    return { puntajeFinal, nivel, timeTakenFormatted };

  }, [answers, questions]);

  // --- ¡AQUÍ ESTABA EL ERROR! --- Ahora llamamos a calculateResults
 const finishAttempt = useCallback(() => {
    const { puntajeFinal, nivel, timeTakenFormatted } = calculateResults();

    // --- ¡CAMBIO CLAVE! ---
    // Preparamos el objeto completo de resultados que la siguiente página necesita
    const resultsPayload = {
      examName: examName,
      generalFeedback: "Esta es una retroalimentación general generada por la IA basada en tu desempeño.", // Placeholder
      timeTaken: timeTakenFormatted,
      finalScore: puntajeFinal,
      level: nivel,
      questions: questions.map(q => {
        // Para cada pregunta, creamos la estructura que necesita QuestionResult
        const userAnswerId = answers[q.question_id];
        const userAnswerObject = q.options.find(opt => opt.option_id === userAnswerId);
        const correctAnswerObject = q.options.find(opt => opt.is_correct);

        return {
          question_id: q.question_id,
          statement: q.statement,
          image_path: q.image_path,
          user_answer: {
            selectedOption: userAnswerId,
            optionText: userAnswerObject ? `${userAnswerObject.label}) ${userAnswerObject.option_text}` : 'No respondida'
          },
          correct_answer: {
            optionId: correctAnswerObject.option_id,
            optionText: `${correctAnswerObject.label}) ${correctAnswerObject.option_text}`
          }
        };
      })
    };

    console.log("Payload de resultados a enviar:", resultsPayload);
    
    const newAttemptId = `attempt-${Date.now()}`;
    endSimulation();
    
    // Navegamos y pasamos el payload completo en el state
    navigate(`/student/resultados/${newAttemptId}`, { 
      state: { 
        results: resultsPayload // Pasamos el objeto completo
      } 
    });
  }, [answers, questions, calculateResults, examName, endSimulation, navigate]);

  const handleConfirmFinish = () => {
    setShowFinishModal(false);
    finishAttempt();
  };

  const handleTimeUp = useCallback(() => {
    setShowTimeUpModal(true);
  }, []);

  const handleCloseTimeUpModal = () => {
    setShowTimeUpModal(false);
    finishAttempt();
  };

  const handleSelectAnswer = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (questions.length === 0) {
    return <div>Cargando preguntas para {examName}...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  const totalMinutes = questionCount * 1.5;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{examName}</h1>
        <Timer initialMinutes={totalMinutes} onTimeUp={handleTimeUp} />
      </div>

      <SimulationQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        selectedAnswer={answers[currentQuestion.question_id]}
        onSelectAnswer={handleSelectAnswer}
      />
      
      <div className="flex justify-between items-center mt-8">
        <Button variant="cancel" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Anterior
        </Button>
        
        {currentQuestionIndex === questions.length - 1 ? (
          <Button variant="danger" className="bg-red-600 hover:bg-red-700" onClick={() => setShowFinishModal(true)}>
            Finalizar
          </Button>
        ) : (
          <Button variant="primary" className="bg-blue-600" onClick={handleNext}>
            Siguiente
          </Button>
        )}
      </div>

      <ConfirmationModal
        show={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleConfirmFinish}
        title="Finalizar Prueba"
        message="¿Estás seguro de que deseas finalizar y enviar tus respuestas? No podrás volver a esta prueba."
        variant="danger"
        confirmText="Sí, finalizar"
        cancelText="Continuar prueba"
      />

      <SuccessModal
        show={showTimeUpModal}
        onClose={handleCloseTimeUpModal}
        title="¡Tiempo Agotado!"
        message="Tu prueba ha finalizado y tus respuestas han sido enviadas. A continuación verás tus resultados."
        variant="info" 
      />
    </div>
  );
};

export default SimulationPage;