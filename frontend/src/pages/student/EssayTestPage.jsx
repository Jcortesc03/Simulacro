import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Timer from '../../components/simulation/Timer';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { PenSquare, Send, Loader2 } from 'lucide-react'; // Añadimos ícono de carga

// --- Componente de Carga de IA ---
// Reutilizamos tu modal de carga, pero con un tema de "Escritura"
const AILoadingModal = ({ show, message }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 border-t-4 border-amber-500">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
             <PenSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Evaluando tu Ensayo
          </h2>
        </div>
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg leading-relaxed mb-4">{message}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-700 text-sm font-medium">
              ⚡ Nuestra IA está analizando tu texto...
            </p>
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


// --- Componente Principal de la Página de Ensayo ---
const EssayTestPage = () => {
  const navigate = useNavigate();
  // const { user } = useAuth(); // Descomenta y ajusta si tienes el contexto de autenticación
  const startTimeRef = useRef(Date.now());

  const [question, setQuestion] = useState(null);
  const [essayText, setEssayText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Cargar la pregunta del ensayo al iniciar
  useEffect(() => {
    const fetchEssayQuestion = async () => {
      try {
        const response = await api.get('/questions/getQuestions', {
          params: {
            categoryName: 'Escritura',
            questionNumber: 1,
          },
        });

        if (response.data && response.data.length > 0) {
          setQuestion(response.data[0]);
        } else {
          setError('No se encontró una pregunta para la prueba de escritura. Por favor, contacta a un administrador.');
        }
      } catch (err) {
        console.error("Error al obtener la pregunta de ensayo:", err);
        setError('No se pudo cargar la prueba. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEssayQuestion();
  }, []);

  // 2. Lógica para finalizar y enviar el ensayo
  const handleFinishEssay = async () => {
    setShowFinishModal(false);

    if (!question) {
      alert("Error: No se ha podido cargar la pregunta. No se puede enviar el ensayo.");
      return;
    }

    setIsSubmitting(true);
    const endTime = new Date();

    try {
      // --- PASO 1: LLAMAR A LA IA PARA OBTENER LA CALIFICACIÓN ---
      const aiPayload = {
        subject: "Escritura",
        question: question.statement,
        answer: essayText,
      };

      console.log("📤 Enviando ensayo para evaluación a la IA:", aiPayload);
      // CÓDIGO CORREGIDO Y FINAL en EssayTestPage.jsx
        console.log("PRUEBA DE DIAGNÓSTICO: Llamando a /tests/saveSimulationAttempt");
        const aiResponse = await api.post('/tests/saveSimulationAttempt', {
            simulation_id: 'test-id',
            total_score: 123,
            status: "test",
            user_answers: []
        });      

          console.log("Respuesta de la prueba de diagnóstico:", aiResponse);
      {/*}    
      const evaluationResult = aiResponse.data.response;
      console.log("🤖 IA ha respondido:", evaluationResult);

      const score = evaluationResult.score || 0;
      const retroalimentation = evaluationResult.feedback || "No se recibió retroalimentación.";
      const level = evaluationResult.level || "Nivel 1";

      // --- PASO 2: GUARDAR EL INTENTO EN LA BASE DE DATOS ---
      const attemptPayload = {
        simulation_id: 'd7783d93-703a-4adb-af63-20dbe3adcf12',
        start_time: new Date(startTimeRef.current).toISOString(),
        end_time: endTime.toISOString(),
        total_score: score,
        status: "completed",
        user_answers: [{
          question_id: question.question_id,
          selected_option_id: null,
          is_correct: score > 150,
          question_score: score,
          answer_text: essayText
        }]
      };

      console.log("💾 Guardando el intento de simulación:", attemptPayload);
      const saveResponse = await api.post('/tests/saveSimulationAttempt', attemptPayload);
      const attemptId = saveResponse.data.response?.insertId || `essay-${Date.now()}`;

      // --- PASO 3: NAVEGAR A LA PÁGINA DE RESULTADOS ---
      const timeTakenInSeconds = Math.round((endTime - startTimeRef.current) / 1000);
      const minutes = Math.floor(timeTakenInSeconds / 60);
      const seconds = timeTakenInSeconds % 60;
      const timeTakenFormatted = `${minutes}m ${seconds}s`;

      navigate(`/student/simulacion/${attemptId}/resultados`, {
        state: {
          results: {
            examName: 'Escritura',
            generalFeedback: retroalimentation,
            timeTaken: timeTakenFormatted,
            finalScore: score,
            level: level,
            questions: [{
              question_id: question.question_id,
              statement: question.statement,
              image_path: question.image_path,
              user_answer: { selectedOption: null, optionText: essayText },
              correct_answer: { optionId: null, optionText: 'Evaluado por IA' }
            }]
          }
        },
      });
        */}
    } catch (err) {
      console.error("Error al finalizar la prueba de ensayo:", err);
      alert("Hubo un problema al calificar o guardar tu ensayo. Por favor, inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  };

  // Función que se ejecuta cuando el temporizador llega a cero
  const handleTimeUp = () => {
    if (essayText.trim().length > 10) {
      alert("El tiempo ha terminado. Tu ensayo se enviará automáticamente.");
      handleFinishEssay();
    } else {
      alert("El tiempo ha terminado. La prueba se anulará porque no se encontró texto.");
      navigate('/student/pruebas');
    }
  };
  
  // --- Estados de Carga y Error ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Cargando prueba de escritura...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error al Cargar</h3>
          <p className="text-red-600">{error}</p>
          <Button onClick={() => navigate('/student/pruebas')} className="mt-4 bg-red-600 hover:bg-red-700">
            Volver a Pruebas
          </Button>
        </div>
      </div>
    );
  }

  // --- Renderizado Principal ---
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header de la prueba */}
        <div className="bg-white rounded-lg shadow-md border-l-4 border-amber-500 p-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Escritura</h1>
            <p className="text-gray-600 text-sm">Desarrolla el tema propuesto a continuación.</p>
          </div>
          <Timer initialMinutes={40} onTimeUp={handleTimeUp} />
        </div>

        {/* Tarjeta principal con pregunta y área de texto */}
        <Card className="shadow-lg">
          <div className="p-8">
            <p className="text-sm font-semibold text-amber-600 mb-2">Pregunta</p>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{question?.statement}</h2>
            {question?.image_path && (
              <div className="my-4 p-2 border rounded-lg bg-gray-50 inline-block">
                <img src={question.image_path} alt="Contexto del ensayo" className="max-w-full h-auto rounded-md" />
              </div>
            )}
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              rows="20"
              className="mt-4 w-full p-4 border-2 border-gray-200 rounded-lg text-base leading-relaxed focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              placeholder="Comienza a escribir tu ensayo aquí..."
            />
          </div>
          <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
            <Button
              variant="primary"
              onClick={() => setShowFinishModal(true)}
              disabled={essayText.trim().length < 50}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 flex items-center gap-2 px-6 py-3 text-base"
            >
              <Send size={18} />
              Finalizar y Entregar
            </Button>
          </div>
        </Card>

        {/* Modales */}
        <ConfirmationModal
          show={showFinishModal}
          onClose={() => setShowFinishModal(false)}
          onConfirm={handleFinishEssay}
          title="¿Entregar Ensayo?"
          message="Estás a punto de entregar tu ensayo para la calificación por IA. No podrás realizar cambios después de esto."
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