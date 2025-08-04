// src/pages/admin/categories/CategoryDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import QuestionCard from '../../../components/questions/QuestionCard';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import SuccessModal from '../../../components/ui/SuccessModal';
import Button from '../../../components/ui/Button';
import { PlusCircle } from 'lucide-react';

// Datos de ejemplo
const allData = {
  'lectura-critica': {
    title: 'Lectura Crítica',
    questions: [
      { id: 1, pregunta: "Pregunta Literal de Lectura Crítica 1...", opciones: [{ texto: "A)", esCorrecta: true }], dificultad: "Fácil", editadoPor: "Admin" },
    ]
  },
  // ... más datos ...
};

export default function CategoryDetailPage() {
  const { categoryPath } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [modal, setModal] = useState({ type: null, isOpen: false, id: null });

  useEffect(() => {
    const categoryData = allData[categoryPath];
    setQuestions(categoryData?.questions || []);
  }, [categoryPath]);

  // --- ¡ESTA ES LA LÓGICA CLAVE CORREGIDA! ---
  const handleAddQuestion = () => {
    // Navega a la página del formulario, pasando la ruta actual para poder volver
    navigate('/admin/questions/add', { state: { from: location.pathname } });
  };
  
  const handleEditQuestion = (question) => {
    // Navega a la página del formulario en modo edición
    navigate(`/admin/questions/edit/${question.id}`, { state: { questionData: question, from: location.pathname } });
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
      
      {/* ¡YA NO HAY MODAL PARA EL FORMULARIO AQUÍ! */}
      <ConfirmationModal show={modal.type === 'deleteConfirm' && modal.isOpen} onConfirm={handleConfirmDelete} onClose={closeNotificationModals} title="Confirmar Eliminación" />
      <SuccessModal show={modal.type === 'deleteSuccess' && modal.isOpen} onClose={closeNotificationModals} message="¡Pregunta eliminada!" />
    </div>
  );
}