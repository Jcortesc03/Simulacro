import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

// Componentes de UI
import Timer from '../../components/simulation/Timer';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import SimulationQuestion from '../../components/simulation/SimulationQuestion';

// --- ¡NUEVO! --- Importamos los datos de las categorías para los colores
import { categoriesData } from '../../data/categoriesData';

// Componente de carga
const AILoadingModal = ({ show, message }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 border-t-4 border-blue-600">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
             <svg className="w-8 h-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Procesando Prueba General</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

const GeneralSimulationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const startTimeRef = useRef(new Date());

  const examName = location.state?.examName || "Simulacro Integral";
  
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGeneralQuestions = async () => {
      try {
        console.log("Cargando preguntas para la Prueba General...");
        const response = await api.get('/questions/getGeneralQuestions');
        const fetchedQuestions = response.data;

        if (fetchedQuestions && fetchedQuestions.length > 0) {
          const formattedQuestions = fetchedQuestions.map(q => {
            if (q.isEssay) {
              return { ...q, options: [] }; 
            }
            return {
              ...q,
              options: (q.answers || []).map((a, index) => ({
                ...a,
                label: String.fromCharCode(65 + index),
              }))
            };
          });
          setQuestions(formattedQuestions);
        } else {
          setError("No se pudieron cargar las preguntas para la prueba general.");
        }
      } catch (err) {
        console.error("Error al cargar la prueba general:", err);
        setError("Hubo un problema de conexión al cargar la prueba.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGeneralQuestions();
  }, []);

  const handleAnswerSelect = (questionId, value) => {
    const currentQuestion = questions[currentQuestionIndex];
    const answerData = currentQuestion.isEssay 
      ? { answer_text: value }
      : { selected_option_id: value };
      
    setAnswers(prev => ({ ...prev, [questionId]: answerData }));
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
  
  const handleTimeUp = () => {
    alert("¡El tiempo se ha acabado! La prueba se enviará automáticamente.");
    handleFinishTest();
  };

  const handleFinishTest = async () => {
    setShowFinishModal(false);
    setIsSubmitting(true);

    try {
      let puntajeObtenidoMC = 0;
      let puntajeMaximoPosibleMC = 0;
      const mcQuestions = questions.filter(q => !q.isEssay);

      mcQuestions.forEach(q => {
        const peso = q.difficulty === "high" ? 30 : q.difficulty === "medium" ? 20 : 10;
        puntajeMaximoPosibleMC += peso;
        const userAnswer = answers[q.question_id];
        const correctOption = q.options.find(opt => opt.is_correct);
        if (userAnswer && userAnswer.selected_option_id === correctOption?.option_id) {
          puntajeObtenidoMC += peso;
        }
      });
      
      const total_score_mc = puntajeMaximoPosibleMC > 0 
        ? Math.round((puntajeObtenidoMC / puntajeMaximoPosibleMC) * 300)
        : 0;

      const finalPayload = {
        simulation_id: 'general-simulation-id', // Puedes usar un ID fijo o dinámico
        start_time: startTimeRef.current.toISOString(),
        end_time: new Date().toISOString(),
        status: 'completed',
        total_score_mc: total_score_mc,
        user_answers: questions.map(q => {
          const userAnswerData = answers[q.question_id] || {};
          const correctOption = q.options.find(opt => opt.is_correct);
          const isCorrect = userAnswerData.selected_option_id === correctOption?.option_id;

          return {
            question_id: q.question_id,
            answer_text: userAnswerData.answer_text || null,
            selected_option_id: userAnswerData.selected_option_id || null,
            is_correct: q.isEssay ? null : isCorrect,
            question_score: q.isEssay ? 0 : (isCorrect ? (q.difficulty === "high" ? 30 : q.difficulty === "medium" ? 20 : 10) : 0)
          };
        })
      };

      console.log("📤 Payload final que se envía al backend:", JSON.stringify(finalPayload, null, 2));

      const response = await api.post('/tests/saveSimulationAttempt', finalPayload);
      const { retroalimentation, score } = response.data;
      
      const timeTakenInSeconds = Math.round((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
      const minutes = Math.floor(timeTakenInSeconds / 60);
      const seconds = timeTakenInSeconds % 60;
      const timeTakenFormatted = `${minutes}m ${seconds}s`;

      let level;
      if (score >= 221) level = "Nivel 4";
      else if (score >= 165) level = "Nivel 3";
      else if (score >= 145) level = "Nivel 2";
      else level = "Nivel 1";

      navigate(`/student/simulacion/general/resultados`, {
        state: {
          results: {
            examName: examName,
            generalFeedback: retroalimentation,
            timeTaken: timeTakenFormatted,
            finalScore: score,
            level: level,
            questions: [] // La revisión detallada para la prueba general es más compleja y se puede añadir después
          }
        },
      });

    } catch (error) {
      console.error("Error al finalizar la prueba general:", error);
      alert("Hubo un problema al enviar tu prueba: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Preparando la Prueba General</h2>
          <p className="text-gray-500">Esto puede tardar un momento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto">
        <h3 className="text-lg font-semibold text-red-700">Error al Cargar</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <Button onClick={() => navigate('/student/pruebas')} className="mt-4">Volver a Pruebas</Button>
      </div>
    );
  }

  if (questions.length === 0) {
      return (
          <div className="text-center p-8">
              <p>No se encontraron preguntas para la prueba.</p>
          </div>
      );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentCategoryName = currentQuestion?.category_name || "Prueba General";
  
  const categoryInfo = categoriesData.find(cat => cat.name === currentCategoryName) || { theme: { main: '#64748b' } };
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{examName}</h1>
            <p className="text-gray-600">
              Sección: <span className="font-semibold" style={{ color: categoryInfo.theme.main }}>{currentCategoryName}</span>
            </p>
          </div>
          <Timer initialMinutes={90} onTimeUp={handleTimeUp} />
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full transition-all duration-500" 
              style={{ 
                width: `${progressPercentage}%`, 
                backgroundColor: categoryInfo.theme.main 
              }}
            ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-right">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
        </p>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <div className="h-2" style={{ backgroundColor: categoryInfo.theme.main }}></div>
        <div className="p-6 min-h-[500px]">
          {currentQuestion.isEssay ? (
            <div>
              <p className="text-sm font-semibold text-amber-600 mb-2">Pregunta de Escritura</p>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{currentQuestion.statement}</h2>
              <textarea
                value={answers[currentQuestion.question_id]?.answer_text || ''}
                onChange={(e) => handleAnswerSelect(currentQuestion.question_id, e.target.value)}
                rows="15"
                className="mt-4 w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Escribe tu ensayo aquí..."
              />
            </div>
          ) : (
            <SimulationQuestion
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={answers[currentQuestion.question_id]?.selected_option_id}
              onSelectAnswer={handleAnswerSelect}
            />
          )}
        </div>
        
        <div className="border-t p-4 flex justify-between items-center bg-gray-50">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Anterior</Button>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button variant="danger" onClick={() => setShowFinishModal(true)}>Finalizar Prueba</Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>Siguiente</Button>
          )}
        </div>
      </Card>
      
      <AILoadingModal show={isSubmitting} message="Calificando tu prueba... Esto puede tardar un momento." />
      <ConfirmationModal
        show={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleFinishTest}
        title="¿Finalizar la Prueba General?"
        message="Una vez que envíes tus respuestas, no podrás realizar cambios. ¿Estás seguro?"
        variant="danger"
        confirmText="Sí, finalizar y enviar"
      />
    </div>
  );
};

export default GeneralSimulationPage;