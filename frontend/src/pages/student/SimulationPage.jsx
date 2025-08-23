import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Timer from '../../components/simulation/Timer';
import SimulationQuestion from '../../components/simulation/SimulationQuestion';
import Button from '../../components/ui/Button';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import SuccessModal from '../../components/ui/SuccessModal';
import { useSimulation } from '../../context/SimulationContext';
import api from '../../api/axiosInstance';
import Card from '../../components/ui/Card';
import QuestionResult from '../../components/simulation/QuestionResult';
import PerformanceMeter from '../../components/simulation/PerformanceMeter';

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

const SimulationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: simulationId } = useParams();
  const { startSimulation, endSimulation } = useSimulation();

  const examName = location.state?.examName || 'Simulacro';
  const questionCount = location.state?.questionCount || 5;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [results, setResults] = useState(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startSimulation();

    const fetchQuestions = async () => {
      try {
        const response = await api.get('/questions/getQuestions', {
          params: {
            categoryName: examName,
            questionNumber: questionCount,
          },
        });

        const formattedQuestions = response.data.map(q => ({
          ...q,
          options: q.answers.map((a, index) => ({
            ...a,
            label: String.fromCharCode(97 + index), // a, b, c, d
          })),
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      }
    };

    fetchQuestions();

    // limpiamos el estado solo si el usuario abandona la página
    return () => endSimulation();
  }, [examName, questionCount, startSimulation, endSimulation]);

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

  const finishAttempt = useCallback(() => {
    const { puntajeFinal, nivel, timeTakenFormatted } = calculateResults();

    const resultsPayload = {
      examName: examName,
      generalFeedback: "Esta es una retroalimentación general generada por la IA basada en tu desempeño.",
      timeTaken: timeTakenFormatted,
      finalScore: puntajeFinal,
      level: nivel,
      questions: questions.map(q => {
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
    setResults(resultsPayload);
    // ❌ ya no llamamos endSimulation aquí
  }, [answers, questions, calculateResults, examName]);

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

  if (results) {
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
                question={q}
                userAnswer={q.user_answer}
                correctAnswer={q.correct_answer}
              />
            ))}
          </div>
        </Card>

        <div className="text-center">
          <Button
            onClick={() => {
              endSimulation(); // 🔹 aquí recién limpiamos el contexto
              navigate('/student/pruebas');
            }}
            variant='primary'
            className="bg-slate-600 hover:bg-slate-800"
          >
            Volver a Pruebas
          </Button>
        </div>
      </div>
    );
  }

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
