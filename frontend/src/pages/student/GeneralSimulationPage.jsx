import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Timer from '../../components/simulation/Timer';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import SimulationQuestion from '../../components/simulation/SimulationQuestion'; 
import { PenSquare } from 'lucide-react';

// El AILoadingModal no necesita cambios
const AILoadingModal = ({ show, message }) => { /* ... tu código ... */ };

const GeneralSimulationPage = () => {
  const navigate = useNavigate();
  const startTimeRef = useRef(new Date());

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
        
        // --- ¡AQUÍ ESTÁ LA CORRECCIÓN MÁS IMPORTANTE! ---
        // Leemos la respuesta desde la clave 'multipleOptionQuestions'
        const fetchedQuestions = response.data;

        if (fetchedQuestions && fetchedQuestions.length > 0) {
          
          // Formateamos las preguntas para que la estructura sea consistente
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
      
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerData
    }));
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
  
  const handleFinishTest = async () => {
    setShowFinishModal(false);
    setIsSubmitting(true);
    
    // --- LÓGICA DE FINALIZACIÓN PENDIENTE ---
    alert("Lógica de finalización pendiente.");
    console.log("Respuestas a enviar:", answers);
    setIsSubmitting(false);
  };
  
  const handleTimeUp = () => {
    alert("¡El tiempo se ha acabado! La prueba se enviará automáticamente.");
    handleFinishTest();
  };

  // Condición de carga mejorada para evitar renderizado prematuro
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

  // Prevenimos el crash si el array de preguntas aún está vacío por alguna razón
  if (questions.length === 0) {
      return <div>No hay preguntas para mostrar.</div>;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentCategoryName = currentQuestion?.category_name || "Prueba General";
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prueba General</h1>
          <p className="text-gray-600">
            Estás en la sección: <span className="font-semibold text-blue-600">{currentCategoryName}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </p>
        </div>
        <Timer initialMinutes={90} onTimeUp={handleTimeUp} />
      </div>

      <Card className="shadow-lg">
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
              onSelectAnswer={(qId, optionId) => handleAnswerSelect(qId, optionId)}
            />
          )}
        </div>
        
        <div className="border-t p-4 flex justify-between items-center bg-gray-50 rounded-b-lg">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Anterior</Button>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button variant="danger" onClick={() => setShowFinishModal(true)}>Finalizar Prueba</Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>Siguiente</Button>
          )}
        </div>
      </Card>
      
      <ConfirmationModal
        show={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleFinishTest}
        title="¿Finalizar la Prueba General?"
        message="Una vez que envíes tus respuestas, no podrás volver a esta prueba. ¿Estás seguro?"
        variant="danger"
        confirmText="Sí, finalizar y enviar"
      />
    </div>
  );
};

export default GeneralSimulationPage;