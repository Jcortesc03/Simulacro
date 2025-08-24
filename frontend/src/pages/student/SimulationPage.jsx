// src/pages/student/SimulationPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Timer from "../../components/simulation/Timer";
import SimulationQuestion from "../../components/simulation/SimulationQuestion";
import Button from "../../components/ui/Button";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import SuccessModal from "../../components/ui/SuccessModal";
import { useSimulation } from "../../context/SimulationContext";
import api from "../../api/axiosInstance";
import Card from "../../components/ui/Card";
import QuestionResult from "../../components/simulation/QuestionResult";
import PerformanceMeter from "../../components/simulation/PerformanceMeter";

// 🔹 Modal bloqueante de carga
const LoadingModal = ({ show, message }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Generando Resultados
        </h2>
        <p className="text-gray-600">{message}</p>
        <div className="mt-6 flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

const ResultsHeader = ({ feedback, time, score, level }) => (
  <Card className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
    <div className="flex-1 p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-2">
        Retroalimentación General
      </h2>
      <p className="text-gray-600">{feedback}</p>
    </div>
    <div className="flex">
      <div className="w-1/2 md:w-auto p-4 text-center">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">
          Tiempo
        </h3>
        <p className="text-3xl font-bold text-gray-800">{time}</p>
      </div>
      <div className="w-1/2 md:w-auto p-4 text-center border-l border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">
          Puntaje Final
        </h3>
        <p className="text-3xl font-bold text-blue-600">{score}</p>
        <span className="mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {level}
        </span>
      </div>
    </div>
  </Card>
);

const SimulationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: simulationId } = useParams();
  const { startSimulation, endSimulation } = useSimulation();

  const examName = location.state?.examName || "Simulacro";
  const questionCount = location.state?.questionCount || 5;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false); // 🔹 nuevo estado
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startSimulation();

    const fetchQuestions = async () => {
      try {
        const response = await api.get("/questions/getQuestions", {
          params: {
            categoryName: examName,
            questionNumber: questionCount,
          },
        });

        const formattedQuestions = response.data.map((q) => ({
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

    return () => endSimulation();
  }, [examName, questionCount, startSimulation, endSimulation]);

  const calculateResults = useCallback(() => {
    let puntajeObtenido = 0;
    let puntajeMaximoPosible = 0;

    const userAnswersFormatted = questions.map((q) => {
      const peso =
        q.difficulty === "high" ? 3 : q.difficulty === "medium" ? 2 : 1;
      puntajeMaximoPosible += peso;

      const userAnswerId = answers[q.question_id];
      const correctOption = q.options.find((opt) => opt.is_correct);

      const isCorrect = userAnswerId === correctOption?.option_id;
      if (isCorrect) puntajeObtenido += peso;

      return {
        question_id: q.question_id,
        selected_option_id: userAnswerId || null,
        is_correct: isCorrect,
        question_score: peso,
      };
    });

    const puntajeFinal =
      puntajeMaximoPosible > 0
        ? Math.round((puntajeObtenido / puntajeMaximoPosible) * 300)
        : 0;

    let nivel;
    if (puntajeFinal >= 221) nivel = "Nivel 4";
    else if (puntajeFinal >= 165) nivel = "Nivel 3";
    else if (puntajeFinal >= 145) nivel = "Nivel 2";
    else nivel = "Nivel 1";

    const endTime = Date.now();
    const timeTakenInSeconds = Math.round(
      (endTime - startTimeRef.current) / 1000
    );
    const minutes = Math.floor(timeTakenInSeconds / 60);
    const seconds = timeTakenInSeconds % 60;
    const timeTakenFormatted = `${minutes}m ${seconds}s`;

    return {
      puntajeFinal,
      nivel,
      timeTakenFormatted,
      userAnswersFormatted,
      endTime,
    };
  }, [answers, questions]);

  const finishAttempt = useCallback(async () => {
    setLoadingResults(true);
    const {
      puntajeFinal,
      nivel,
      timeTakenFormatted,
      userAnswersFormatted,
      endTime,
    } = calculateResults();

    const payload = {
      user_answers: userAnswersFormatted,
      simulation_id: simulationId,
      start_time: new Date(startTimeRef.current).toISOString(),
      end_time: new Date(endTime).toISOString(),
      total_score: puntajeFinal,
      status: "completed",
    };

    try {
      console.log("📤 Enviando datos al backend:", payload);

      const res = await api.post("/tests/saveSimulationAttempt", payload);

      console.log("📥 Respuesta completa del backend:", res.data);
      console.log("🤖 Retroalimentación recibida:", res.data.retroalimentation);

      // Verificar si la retroalimentación existe
      const retroalimentacion =
        res.data.retroalimentation ||
        res.data.retroalimentación ||
        "No se pudo generar retroalimentación.";

      setResults({
        examName,
        generalFeedback: retroalimentacion, // ← Fix principal aquí
        timeTaken: timeTakenFormatted,
        finalScore: puntajeFinal,
        level: nivel,
        questions: questions.map((q) => {
          const userAnswerId = answers[q.question_id];
          const userAnswerObject = q.options.find(
            (opt) => opt.option_id === userAnswerId
          );
          const correctAnswerObject = q.options.find((opt) => opt.is_correct);
          return {
            question_id: q.question_id,
            statement: q.statement,
            image_path: q.image_path,
            user_answer: {
              selectedOption: userAnswerId,
              optionText: userAnswerObject
                ? `${userAnswerObject.label}) ${userAnswerObject.option_text}`
                : "No respondida",
            },
            correct_answer: {
              optionId: correctAnswerObject.option_id,
              optionText: `${correctAnswerObject.label}) ${correctAnswerObject.option_text}`,
            },
          };
        }),
      });
    } catch (err) {
      console.error("❌ Error guardando intento:", err);
      console.error("❌ Error response:", err.response?.data);

      // Mostrar error al usuario pero continuar con resultados básicos
      setResults({
        examName,
        generalFeedback:
          "Error al generar retroalimentación. Por favor, contacta al administrador.",
        timeTaken: timeTakenFormatted,
        finalScore: puntajeFinal,
        level: nivel,
        questions: [], // Simplificar en caso de error
      });
    } finally {
      setLoadingResults(false);
    }
  }, [answers, questions, calculateResults, examName, simulationId]);

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
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // 🔹 Render de resultados
  if (results) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Resultados: {results.examName}
        </h1>

        <ResultsHeader
          feedback={results.generalFeedback}
          time={results.timeTaken}
          score={Math.round(results.finalScore)}
          level={results.level}
        />

        <PerformanceMeter score={results.finalScore} level={results.level} />

        <Card>
          <h2 className="text-xl font-bold text-gray-800 p-4 border-b">
            Revisión de Preguntas
          </h2>
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
              endSimulation();
              navigate("/student/pruebas");
            }}
            variant="primary"
            className="bg-slate-600 hover:bg-slate-800"
          >
            Volver a Pruebas
          </Button>
        </div>
      </div>
    );
  }

  // 🔹 Loading inicial
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
        <Button
          variant="cancel"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </Button>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            variant="danger"
            className="bg-red-600 hover:bg-red-700"
            onClick={() => setShowFinishModal(true)}
          >
            Finalizar
          </Button>
        ) : (
          <Button
            variant="primary"
            className="bg-blue-600"
            onClick={handleNext}
          >
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

      {/* 🔹 Modal bloqueante de carga IA */}
      <LoadingModal
        show={loadingResults}
        message="La IA está generando la retroalimentación con base en tus respuestas, por favor espera..."
      />
    </div>
  );
};

export default SimulationPage;
