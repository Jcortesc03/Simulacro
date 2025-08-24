// src/pages/admin/categories/CategoryDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import QuestionCard from "../../../components/questions/QuestionCard";
import ConfirmationModal from "../../../components/ui/ConfirmationModal";
import SuccessModal from "../../../components/ui/SuccessModal";
import Button from "../../../components/ui/Button";
import { PlusCircle, ArrowLeft } from "lucide-react";
import api from "../../../api/axiosInstance.jsx";

export default function CategoryDetailPage() {
  const { categoryPath } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [modal, setModal] = useState({ type: null, isOpen: false, id: null });
  const categoryName = location.state?.categoryName;

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!categoryName) return;
      try {
        const res = await api.get("/questions/getQuestions", {
          params: {
            categoryName,
            questionNumber: 50,
          },
        });
        const mapped = res.data.map((q) => ({
          id: q.question_id,
          enunciado: q.statement,
          opciones: q.answers.map((a) => ({
            texto: a.option_text,
            esCorrecta: a.is_correct,
          })),
          dificultad: q.difficulty,
          editadoPor: "Sistema",
          imagePath: q.image_path || null,
        }));
        setQuestions(mapped);
      } catch (error) {
        console.error("Error cargando preguntas", error);
        setQuestions([]);
      }
    };

    if (categoryName) {
      fetchQuestions();
    }
  }, [categoryName]);

  const handleBackToCategories = () => {
    navigate("/admin/categories");
  };

  const handleAddQuestion = () => {
    navigate("/admin/questions/add", { state: { from: location.pathname } });
  };

  const handleEditQuestion = (question) => {
    navigate(`/admin/questions/edit/${question.id}`, {
      state: { questionData: question, from: location.pathname },
    });
  };

  const handleDeleteClick = (questionId) => {
    setModal({ type: "deleteConfirm", isOpen: true, id: questionId });
  };

  const handleConfirmDelete = () => {
    setModal({ type: "deleteSuccess", isOpen: true });
  };

  const closeNotificationModals = () => {
    setModal({ type: null, isOpen: false, id: null });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header con botón de regreso y título de categoría */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={handleBackToCategories}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span>Volver a Categorías</span>
          </Button>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Categoría: {categoryName || "Sin nombre"}
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona las preguntas de esta categoría
          </p>
        </div>
      </div>

      {/* Botón de añadir pregunta */}
      <div className="flex justify-end mb-8">
        <Button
          onClick={handleAddQuestion}
          variant="primary"
          className="bg-blue-600"
        >
          <PlusCircle className="inline md:mr-2" />
          <span className="hidden md:inline">Añadir Pregunta</span>
        </Button>
      </div>

      {/* Lista de preguntas */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Preguntas Existentes
        </h2>
        {questions.length > 0 ? (
          questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onEdit={() => handleEditQuestion(q)}
              onDelete={() => handleDeleteClick(q.id)}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 bg-gray-100 p-8 rounded-lg">
            <p className="font-semibold">
              No hay preguntas para esta categoría.
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
      <ConfirmationModal
        show={modal.type === "deleteConfirm" && modal.isOpen}
        onConfirm={handleConfirmDelete}
        onClose={closeNotificationModals}
        title="Confirmar Eliminación"
      />
      <SuccessModal
        show={modal.type === "deleteSuccess" && modal.isOpen}
        onClose={closeNotificationModals}
        message="¡Pregunta eliminada!"
      />
    </div>
  );
}
