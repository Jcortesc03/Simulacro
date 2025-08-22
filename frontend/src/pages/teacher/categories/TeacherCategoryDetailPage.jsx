// src/pages/teacher/categories/TeacherCategoryDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import QuestionCard from '../../../components/questions/QuestionCard';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import SuccessModal from '../../../components/ui/SuccessModal';
import Button from '../../../components/ui/Button';
import { PlusCircle } from 'lucide-react';

const allData =   
{'lectura-critica': {
    title: 'Lectura Crítica',
    questions: [
      { id: 1, pregunta: "Pregunta de Lectura Crítica 1 (Vista Profesor)...", opciones: [{ texto: "A)", esCorrecta: true }], dificultad: "Fácil", editadoPor: "Profesor" },
      { 
        id: 101, 
        pregunta: "Esta es una NUEVA pregunta de prueba. ¿Cuál es su dificultad?", 
        opciones: [
          { texto: "Fácil", esCorrecta: false },
          { texto: "Media", esCorrecta: true },
          { texto: "Difícil", esCorrecta: false },
          { texto: "Muy Difícil", esCorrecta: false }
        ],
        dificultad: "Media", 
        editadoPor: "Profesor" 
      }
    ]
  },
  // ... más datos
};
export default function TeacherCategoryDetailPage() {
  const { categoryPath } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [modal, setModal] = useState({ type: null, isOpen: false, id: null });

  useEffect(() => {
    const categoryData = allData[categoryPath];
    setQuestions(categoryData?.questions || []);
  }, [categoryPath]);

  // --- ¡LÓGICA DE NAVEGACIÓN! ---
  const handleAddQuestion = () => {
    navigate('/teacher/questions/add', { state: { from: location.pathname } });
  };
  
  const handleEditQuestion = (question) => {
    navigate(`/teacher/questions/edit/${question.id}`, { state: { questionData: question, from: location.pathname } });
  };
  
  const handleDeleteClick = (questionId) => setModal({ type: 'deleteConfirm', isOpen: true, id: questionId });
  const handleConfirmDelete = () => setModal({ type: 'deleteSuccess', isOpen: true });
  const closeNotificationModals = () => setModal({ type: null, isOpen: false, id: null });

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
      
      {/* Ya no hay modal de formulario aquí, solo los de notificación */}
      <ConfirmationModal show={modal.type === 'deleteConfirm' && modal.isOpen} onConfirm={handleConfirmDelete} onClose={closeNotificationModals} title="Confirmar Eliminación" />
      <SuccessModal show={modal.type === 'deleteSuccess' && modal.isOpen} onClose={closeNotificationModals} message="¡Pregunta eliminada!" />
    </div>
  );
}