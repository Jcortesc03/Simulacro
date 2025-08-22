// src/pages/teacher/categories/TeacherCategoryDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import QuestionCard from '../../components/questions/QuestionCard';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import SuccessModal from '../../components/ui/SuccessModal';
import Button from '../../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import api from '../../api/axiosInstance'; // Asegúrate de tener la instancia de axios

// Mapeo de URL a nombre real (igual que en admin)
const categoryMap = {
  'lectura-critica': 'Critical Reading',
  'razonamiento-cuantitativo': 'Quantitative Reasoning',
  'competencias-ciudadanas': 'Civic Competencies',
  'comunicacion-escrita': 'Writing',
  'ingles': 'English'
};

export default function TeacherCategoryDetailPage() {
  const { categoryPath } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [modal, setModal] = useState({ type: null, isOpen: false, id: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const categoryName = categoryMap[categoryPath];
      if (!categoryName) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      try {
        // ✅ Usa GET con params, como ya funciona en backend
        const res = await api.get('/questions/getQuestions', {
          params: {
            categoryName,
            questionNumber: 50
          }
        });

        // Mapea los datos del backend al formato que usa QuestionCard
        const mapped = Array.isArray(res.data) ? res.data.map(q => {
          const isSystem =   
            q.createdBy === 'system' || 
            q.aiGenerated === true || 
            q.source === 'default' || 
            !q.createdBy; // si no tiene creador, asume que es del sistema

      return {
          id: q.question_id,
          enunciado: q.statement,
          pregunta: q.statement,
          opciones: q.answers.map(a => ({
            texto: a.option_text,
            esCorrecta: a.is_correct
          })),
          dificultad: q.difficulty,
          editadoPor: q.created_by || "Sistema",
          isSystem
      };
        }) : [];

        setQuestions(mapped);
      } catch (error) {
        console.error('Error cargando preguntas', error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryPath]);

  const handleAddQuestion = () => {
    navigate('/teacher/questions/add', { state: { from: location.pathname } });
  };

  const handleEditQuestion = (question) => {
    navigate(`/teacher/questions/edit/${question.id}`, {
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

  if (loading) {
    return <div className="p-6 text-center">Cargando preguntas...</div>;
  }

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
             onEdit={q.isSystem ? undefined : () => handleEditQuestion(q)} // solo si NO es del sistema
             onDelete={q.isSystem ? undefined : () => handleDeleteClick(q.id)} // solo si NO es del sistema
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