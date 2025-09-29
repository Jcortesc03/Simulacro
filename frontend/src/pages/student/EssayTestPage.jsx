import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Timer from '../../components/simulation/Timer';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { PenSquare, Send } from 'lucide-react';

const AILoadingModal = ({ show, message }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 border-t-4 border-amber-500">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
             <PenSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Evaluando tu Ensayo</h2>
        </div>
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg leading-relaxed mb-4">{message}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-700 text-sm font-medium">⚡ Nuestra IA está analizando tu texto...</p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-amber-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EssayTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const startTimeRef = useRef(new Date());

  const examName = location.state?.examName;
  const simulationId = location.state?.simulationId;

  const [question, setQuestion] = useState(null);
  const [essayText, setEssayText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!simulationId || !examName) {
      setError("No se ha seleccionado una prueba válida. Por favor, regresa y elige una de nuevo.");
      setIsLoading(false);
      return;
    }

    const fetchEssayQuestion = async () => {
      try {
        console.log(`Cargando pregunta para la categoría: "${examName}"`);
        const response = await api.get('/questions/getQuestions', {
          params: { categoryName: examName, questionNumber: 1 }
        });
        
        if (response.data && response.data.length > 0) {
          setQuestion(response.data[0]);
        } else {
          setError(`No se encontraron preguntas para la categoría "${examName}".`);
        }
      } catch (err) {
        console.error("Error fetching essay question:", err);
        setError('No se pudo cargar la prueba. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEssayQuestion();
  }, [examName, simulationId]);

  const handleFinishEssay = async () => {
    setShowFinishModal(false);
    if (!question) return;

    setIsSubmitting(true);
    const endTime = new Date();

    try {
      // YA NO NECESITAMOS MANEJAR EL TOKEN AQUÍ.
      // El backend identificará al usuario a través de la cookie 'jwt'.
       console.log("🔍 Question object:", question);
      console.log("🔍 Question ID:", question.question_id);
      console.log("🔍 Essay text length:", essayText.length);
      const attemptPayload = {
        simulation_id: simulationId,
        start_time: startTimeRef.current.toISOString(),
        end_time: endTime.toISOString(),
        status: "completed",
        user_answers: [{
          question_id: question.question_id,
          answer_text: essayText,
          selected_option_id: null,
          is_correct: false, // El backend podría manejar esto
          question_score: 0 // El backend calculará esto
        }]
      };
      
      console.log("📤 Payload que se envía:", JSON.stringify(attemptPayload, null, 2));
      
      // La instancia 'api' ya está configurada con withCredentials: true
      const response = await api.post('/tests/saveSimulationAttempt', attemptPayload);
      const { retroalimentation, score } = response.data;
      
      const timeTakenInSeconds = Math.round((endTime.getTime() - startTimeRef.current.getTime()) / 1000);
      const minutes = Math.floor(timeTakenInSeconds / 60);
      const seconds = timeTakenInSeconds % 60;
      const timeTakenFormatted = `${minutes}m ${seconds}s`;

      let level;
      if (score >= 221) level = "Nivel 4";
      else if (score >= 165) level = "Nivel 3";
      else if (score >= 145) level = "Nivel 2";
      else level = "Nivel 1";

      navigate(`/student/simulacion/${simulationId}/resultados`, {
        state: {
          results: {
            examName: examName,
            generalFeedback: retroalimentation,
            timeTaken: timeTakenFormatted,
            finalScore: score,
            level: level,
            questions: [],
          }
        },
      });

    } catch (err) {
      console.error("Error al finalizar la prueba de ensayo:", err);
      let errorMessage = "Hubo un problema al guardar tu ensayo.";
      if (err.response) {
        errorMessage = err.response.data?.message || err.response.data || errorMessage;
        if (err.response.status === 401) {
            alert("Tu sesión ha expirado. Serás redirigido al inicio de sesión.");
            navigate('/login');
            return;
        }
      }
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => handleFinishEssay();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pregunta de ensayo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error al Cargar</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md border-l-4 border-amber-500 p-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{examName}</h1>
            <p className="text-gray-600 text-sm">Desarrolla el tema propuesto a continuación.</p>
          </div>
          <Timer initialMinutes={40} onTimeUp={handleTimeUp} />
        </div>
        <Card className="shadow-lg">
          <div className="p-8">
            <p className="text-sm font-semibold text-amber-600 mb-2">Pregunta</p>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{question?.statement}</h2>
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              rows="20"
              className="mt-4 w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="Comienza a escribir tu ensayo aquí..."
            />
          </div>
          <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
            <Button
              variant="primary"
              onClick={() => setShowFinishModal(true)}
              disabled={!question || essayText.trim().length < 50 || isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <Send size={18} />
              Finalizar y Entregar
            </Button>
          </div>
        </Card>
        <ConfirmationModal
          show={showFinishModal}
          onClose={() => setShowFinishModal(false)}
          onConfirm={handleFinishEssay}
          title="¿Entregar Ensayo?"
          message="No podrás realizar cambios después de esto."
          variant="primary"
          confirmText="Sí, entregar ahora"
        />
        <AILoadingModal
          show={isSubmitting}
          message="Nuestra IA está leyendo tu ensayo para darte una retroalimentación detallada. Este proceso puede tardar unos segundos."
        />
      </div>
    </div>
  );
};

export default EssayTestPage;