// src/pages/admin/categories/CategoryDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import QuestionCard from '../../../components/questions/QuestionCard';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import SuccessModal from '../../../components/ui/SuccessModal';
import Button from '../../../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import api from '../../../api/axiosInstance.jsx';

// Mapeo de URL a nombre real
const categoryMap = {
  'lectura-critica': 'Critical Reading',
  'razonamiento-cuantitativo': 'Quantitative Reasoning',
  'competencias-ciudadanas': 'Civic Competencies',
  'comunicacion-escrita': 'Writing',
  'ingles': 'English'
};

export default function CategoryDetailPage() {
  const { categoryPath } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [modal, setModal] = useState({ type: null, isOpen: false, id: null });

  useEffect(() => {
    const fetchQuestions = async () => {
      const categoryName = categoryMap[categoryPath];
      if (!categoryName) return;

      try {
        // CORRECCIÓN: Los parámetros van directamente en el body, no dentro de params
        const res = await api.post('/questions/getQuestions', {
          categoryName,
          questionNumber: 50
        });

        // Mapea a formato de ejemplo
        const mapped = res.data.map(q => ({
          id: q.question_id,
          enunciado: q.statement,
          pregunta: q.statement,
          opciones: q.answers.map(a => ({
            texto: a.option_text,
            esCorrecta: a.is_correct
          })),
          dificultad: q.difficulty,
          editadoPor: "Sistema"
        }));

        setQuestions(mapped);
      } catch (error) {
        console.error('Error cargando preguntas', error);
        setQuestions([]);
      }
    };

    fetchQuestions();
  }, [categoryPath]);

  const handleAddQuestion = () => {
    navigate('/admin/questions/add', { state: { from: location.pathname } });
  };

  const handleEditQuestion = (question) => {
    navigate(`/admin/questions/edit/${question.id}`, { 
      state: { questionData: question, from: location.pathname } 
    });
  };

  const handleDeleteClick = (questionId) => {
    setModal({ type: 'deleteConfirm', isOpen: true, id: questionId });
  };

  const handleConfirmDelete = () => {
    setModal({ type: 'deleteSuccess', isOpen: true });
  };

  const closeNotificationModals = () => {
    setModal({ type: null, isOpen: false, id: null });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-end mb-8">
        <Button onClick={handleAddQuestion} variant="primary" className="bg-blue-600">
          <PlusCircle className="inline md:mr-2" />
          <span className="hidden md:inline">Añadir Pregunta</span>
        </Button>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Preguntas Existentes</h2>
        {questions.length > 0 ? (
          questions.map(q => (
            <QuestionCard 
              key={q.id} 
              question={q}
              onEdit={() => handleEditQuestion(q)}
              onDelete={() => handleDeleteClick(q.id)}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 bg-gray-100 p-8 rounded-lg">
            <p className="font-semibold">No hay preguntas para esta categoría.</p>
          </div>
        )}
      </div>
      
      <ConfirmationModal 
        show={modal.type === 'deleteConfirm' && modal.isOpen} 
        onConfirm={handleConfirmDelete} 
        onClose={closeNotificationModals} 
        title="Confirmar Eliminación" 
      />
      <SuccessModal 
        show={modal.type === 'deleteSuccess' && modal.isOpen} 
        onClose={closeNotificationModals} 
        message="¡Pregunta eliminada!" 
      />
    </div>
  );
}