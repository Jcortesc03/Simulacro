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

// 🎯 Modal institucional de carga con IA
const AILoadingModal = ({ show, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 border-t-4 border-blue-600">
        {/* Encabezado institucional */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Procesando Resultados
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
        </div>

        {/* Contenido del mensaje */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg leading-relaxed mb-4">{message}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-700 text-sm font-medium">
              ⚡ Inteligencia Artificial analizando tus respuestas...
            </p>
          </div>
        </div>

        {/* Animación de carga profesional */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Este proceso puede tomar unos momentos. No cierre esta ventana.
          </p>
        </div>
      </div>
    </div>
  );
};

// 📋 Componente de retroalimentación expandible
const FeedbackSection = ({ feedback, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Función para obtener un resumen corto
  const getShortFeedback = (text) => {
    if (!text) return "No hay retroalimentación disponible.";
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    return sentences.length > 2 ? sentences.slice(0, 2).join('.') + '.' : text;
  };

  const shortFeedback = getShortFeedback(feedback);
  const shouldShowExpandButton = feedback && feedback.length > shortFeedback.length;

  return (
    <div className={`${className}`}>
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Retroalimentación Personalizada
        </h2>
        {shouldShowExpandButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center"
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Mostrar menos
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Ver completa
              </>
            )}
          </button>
        )}
      </div>

      <div className="prose max-w-none">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {isExpanded ? feedback : shortFeedback}
          </p>
        </div>
      </div>

      {shouldShowExpandButton && !isExpanded && (
        <div className="mt-2">
          <span className="text-xs text-gray-500 italic">
            Haz clic en "Ver completa" para leer el análisis completo de la IA
          </span>
        </div>
      )}
    </div>
  );
};

// 🏆 Header de resultados mejorado
const ResultsHeader = ({ feedback, time, score, level }) => (
  <Card className="overflow-hidden border-t-4 border-blue-600 shadow-lg">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
      <h1 className="text-2xl font-bold text-white flex items-center">
        <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Resumen de tu Evaluación
      </h1>
    </div>

    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retroalimentación */}
        <div className="lg:col-span-2">
          <FeedbackSection feedback={feedback} />
        </div>

        {/* Métricas */}
        <div className="space-y-4">
          {/* Tiempo */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Tiempo Utilizado
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">{time}</p>
          </div>

          {/* Puntaje */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Puntaje Final
              </h3>
            </div>
            <p className="text-3xl font-bold text-blue-700 mb-2">{score}</p>
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {level}
            </span>
          </div>
        </div>
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
  const [loadingResults, setLoadingResults] = useState(false);
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

      const retroalimentacion =
        res.data.retroalimentation ||
        res.data.retroalimentación ||
        "No se pudo generar retroalimentación personalizada para esta evaluación.";

      setResults({
        examName,
        generalFeedback: retroalimentacion,
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

      setResults({
        examName,
        generalFeedback:
          "Lo sentimos, hubo un error al generar la retroalimentación personalizada. Nuestro equipo técnico ha sido notificado y trabajará para resolver este inconveniente. Tus respuestas han sido guardadas correctamente.",
        timeTaken: timeTakenFormatted,
        finalScore: puntajeFinal,
        level: nivel,
        questions: [],
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

  // 🎯 Render de resultados mejorado
  if (results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {/* Título principal */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Resultados de Evaluación
            </h1>
            <p className="text-xl text-gray-600">{results.examName}</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-4"></div>
          </div>

          {/* Header de resultados */}
          <ResultsHeader
            feedback={results.generalFeedback}
            time={results.timeTaken}
            score={Math.round(results.finalScore)}
            level={results.level}
          />

          {/* Medidor de rendimiento */}
          <PerformanceMeter score={results.finalScore} level={results.level} />

          {/* Revisión de preguntas */}
          {results.questions.length > 0 && (
            <Card className="shadow-lg">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Análisis Detallado por Pregunta
                </h2>
                <p className="text-gray-600 mt-1">
                  Revisa tus respuestas y compáralas con las correctas
                </p>
              </div>
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
          )}

          {/* Botón de navegación */}
          <div className="text-center py-8">
            <Button
              onClick={() => {
                endSimulation();
                navigate("/student/pruebas");
              }}
              variant="primary"
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Regresar a Mis Pruebas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 🔄 Loading inicial mejorado
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Preparando tu evaluación
          </h2>
          <p className="text-gray-600">
            Cargando preguntas para <span className="font-medium text-blue-600">{examName}</span>
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalMinutes = questionCount * 1.5;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header compacto de la simulación */}
        <div className="bg-white rounded-lg shadow-md border-l-4 border-blue-600 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{examName}</h1>
              <p className="text-gray-600 text-sm">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </p>
            </div>
            <div className="mt-3 lg:mt-0">
              <Timer initialMinutes={totalMinutes} onTimeUp={handleTimeUp} />
            </div>
          </div>
        </div>

        {/* Área principal de la pregunta - MÁS GRANDE */}
        <div className="bg-white rounded-xl shadow-lg mb-6 min-h-[600px] flex flex-col">
          <div className="flex-1 p-8">
            <SimulationQuestion
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={answers[currentQuestion.question_id]}
              onSelectAnswer={handleSelectAnswer}
            />
          </div>

          {/* Controles de navegación integrados */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <Button
                variant="cancel"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center px-6 py-3"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </Button>

              {/* Indicador de progreso central */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentQuestionIndex
                          ? 'bg-blue-600'
                          : index < currentQuestionIndex
                          ? 'bg-green-500'
                          : answers[questions[index]?.question_id]
                          ? 'bg-yellow-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-3">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  variant="danger"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 flex items-center px-6 py-3"
                  onClick={() => setShowFinishModal(true)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Finalizar Evaluación
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center px-6 py-3"
                  onClick={handleNext}
                >
                  Siguiente
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Modales */}
        <ConfirmationModal
          show={showFinishModal}
          onClose={() => setShowFinishModal(false)}
          onConfirm={handleConfirmFinish}
          title="¿Finalizar Evaluación?"
          message="¿Estás seguro de que deseas finalizar y enviar tus respuestas? Una vez enviadas, no podrás modificar tus respuestas ni volver a realizar esta prueba."
          variant="danger"
          confirmText="Sí, finalizar evaluación"
          cancelText="Continuar respondiendo"
        />

        <SuccessModal
          show={showTimeUpModal}
          onClose={handleCloseTimeUpModal}
          title="¡Tiempo Agotado!"
          message="El tiempo para completar tu evaluación ha finalizado. Tus respuestas han sido enviadas automáticamente. A continuación podrás revisar tus resultados."
          variant="info"
        />

        {/* Modal de carga con IA */}
        <AILoadingModal
          show={loadingResults}
          message="Nuestro sistema de inteligencia artificial está analizando detalladamente tus respuestas para brindarte una retroalimentación personalizada y constructiva."
        />
      </div>
    </div>
  );
};

export default SimulationPage;
