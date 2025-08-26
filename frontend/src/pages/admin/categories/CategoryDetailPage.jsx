// src/pages/admin/categories/CategoryDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import QuestionCard from "../../../components/questions/QuestionCard";
import ConfirmationModal from "../../../components/ui/ConfirmationModal";
import SuccessModal from "../../../components/ui/SuccessModal";
import Button from "../../../components/ui/Button";
import {
  PlusCircle,
  ArrowLeft,
  BookOpen,
  FileText,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../../api/axiosInstance.jsx";
import { categoriesData } from "../../../data/categoriesData";

export default function CategoryDetailPage() {
  const { categoryPath } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, isOpen: false, id: null });
  const categoryName = location.state?.categoryName;
  const questionsPerPage = 8;

  // Obtener el tema de la categoría
  const categoryTheme = categoriesData.find(
    (cat) => cat.name === categoryName || cat.path === categoryPath
  )?.theme || { main: "#4A90E2", light: "#DDEBFF" };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!categoryName) return;
      try {
        const res = await api.get("/questions/getQuestions", {
          params: {
            categoryName,
            questionNumber: 50000,
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
        setFilteredQuestions(mapped);
      } catch (error) {
        console.error("Error cargando preguntas", error);
        setQuestions([]);
        setFilteredQuestions([]);
      }
    };

    if (categoryName) {
      fetchQuestions();
    }
  }, [categoryName]);

  // Efecto para filtrar preguntas
  useEffect(() => {
    let filtered = questions;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.enunciado.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.opciones.some((opcion) =>
            opcion.texto.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filtrar por dificultad
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((q) => q.dificultad === difficultyFilter);
    }

    setFilteredQuestions(filtered);
    setCurrentPage(1); // Reset a la primera página cuando se filtran
  }, [questions, searchTerm, difficultyFilter]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  const handleBackToCategories = () => {
    navigate("/admin/categories");
  };

  const handleAddQuestion = () => {
    navigate("/admin/questions", { state: { from: location.pathname } });
  };

 const handleEditQuestion = async (question) => {
  try {
    // Obtener información de categorías disponibles para mapear el categoryName actual
    const categoriesResponse = await api.get("/admin/getCategories");
    const categories = categoriesResponse.data || [];

    // Buscar la categoría actual por nombre
    const currentCategory = categories.find(cat => cat.category_name === categoryName);

    // Obtener subcategorías
    const subCategoriesResponse = await api.get("/admin/subcategories");
    const subCategories = subCategoriesResponse.data || [];

    // Filtrar subcategorías de la categoría actual
    const currentSubCategories = subCategories.filter(
      subcat => subcat.category_id === currentCategory?.category_id
    );

    // Preparar los datos completos para el formulario
    const questionDataForEdit = {
      ...question,
      selectedCategory: currentCategory?.category_id,
      selectedSubCategory: currentSubCategories.length === 1
        ? currentSubCategories[0].sub_category_id
        : undefined, // Si hay más de una subcategoría, el usuario deberá seleccionar
      categoryName: categoryName, // Pasar el nombre de categoría también
    };

    navigate(`/admin/questions/edit/${question.id}`, {
      state: {
        questionData: questionDataForEdit,
        from: location.pathname
      },
    });
  } catch (error) {
    console.error("Error obteniendo datos de categorías:", error);

    // Fallback: navegar con los datos básicos y el categoryName
    const questionDataForEdit = {
      ...question,
      categoryName: categoryName,
    };

    navigate(`/admin/questions/edit/${question.id}`, {
      state: {
        questionData: questionDataForEdit,
        from: location.pathname
      },
    });
  }
};

  const handleDeleteClick = (questionId) => {
    setModal({ type: "deleteConfirm", isOpen: true, id: questionId });
  };

  const handleConfirmDelete = async () => {
    if (!modal.id) return;

    try {
      await api.delete(`/questions/${modal.id}`);
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== modal.id)
      );
      setModal({ type: "deleteSuccess", isOpen: true, id: null });
    } catch (error) {
      console.error("Error al eliminar la pregunta", error);
      // Opcionalmente, mostrar un modal de error
      setModal({ type: null, isOpen: false, id: null });
    }
  };

  const closeNotificationModals = () => {
    setModal({ type: null, isOpen: false, id: null });
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header institucional con gradiente sutil */}
      <div
        className="bg-gradient-to-r from-white to-gray-50 shadow-sm border-b-4 mb-8"
        style={{ borderBottomColor: categoryTheme.main }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Navegación de regreso */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={handleBackToCategories}
              variant="secondary"
              className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Volver a Categorías</span>
            </Button>
          </div>

          {/* Título principal */}
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl shadow-sm"
              style={{ backgroundColor: categoryTheme.light }}
            >
              <BookOpen size={32} style={{ color: categoryTheme.main }} />
            </div>
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: categoryTheme.main }}
              >
                {categoryName || "Categoría"}
              </h1>
              <p className="text-gray-600 text-lg">
                Gestiona y administra las preguntas de esta categoría académica
              </p>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: categoryTheme.light }}
                >
                  <FileText size={20} style={{ color: categoryTheme.main }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredQuestions.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    {filteredQuestions.length !== questions.length
                      ? `de ${questions.length} Preguntas`
                      : "Preguntas Disponibles"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: categoryTheme.light }}
                >
                  <Users size={20} style={{ color: categoryTheme.main }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">Activo</p>
                  <p className="text-sm text-gray-600">Estado de Categoría</p>
                </div>
              </div>
            </div>

            {/* Botón de agregar pregunta integrado en las estadísticas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Button
                onClick={handleAddQuestion}
                className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed hover:border-solid transition-all duration-300"
                style={{
                  borderColor: categoryTheme.main,
                  color: categoryTheme.main,
                  backgroundColor: "transparent",
                }}
                variant="secondary"
              >
                <PlusCircle size={24} />
                <span className="font-semibold">Agregar Pregunta</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Sección de preguntas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="px-8 py-6 border-b border-gray-100"
            style={{ backgroundColor: `${categoryTheme.light}15` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText size={24} style={{ color: categoryTheme.main }} />
                <h2
                  className="text-2xl font-bold"
                  style={{ color: categoryTheme.main }}
                >
                  Banco de Preguntas
                </h2>
              </div>
              <div className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Listado completo de preguntas disponibles para esta categoría
            </p>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Buscador */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar preguntas por contenido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRingColor: categoryTheme.main }}
                />
              </div>

              {/* Filtro de dificultad */}
              <div className="min-w-48">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRingColor: categoryTheme.main }}
                >
                  <option value="all">Todas las dificultades</option>
                  <option value="low">Fácil</option>
                  <option value="medium">Medio</option>
                  <option value="high">Difícil</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-8">
            {currentQuestions.length > 0 ? (
              <>
                <div className="space-y-6">
                  {currentQuestions.map((q, index) => (
                    <div key={q.id} className="group">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm"
                          style={{ backgroundColor: categoryTheme.main }}
                        >
                          {startIndex + index + 1}
                        </div>
                        <div className="flex-grow">
                          <QuestionCard
                            question={q}
                            onEdit={() => handleEditQuestion(q)}
                            onDelete={() => handleDeleteClick(q.id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controles de paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
                    <Button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      variant="secondary"
                      className="flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Mostrando {startIndex + 1}-
                        {Math.min(endIndex, filteredQuestions.length)} de{" "}
                        {filteredQuestions.length}
                      </span>
                    </div>

                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      variant="secondary"
                      className="flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div
                  className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: categoryTheme.light }}
                >
                  <FileText size={32} style={{ color: categoryTheme.main }} />
                </div>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: categoryTheme.main }}
                >
                  {questions.length === 0
                    ? "No hay preguntas disponibles"
                    : "No se encontraron preguntas"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {questions.length === 0
                    ? "Esta categoría aún no tiene preguntas registradas. Comienza agregando la primera pregunta para construir el banco de evaluaciones."
                    : "No se encontraron preguntas que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda."}
                </p>
                {questions.length === 0 && (
                  <Button
                    onClick={handleAddQuestion}
                    variant="primary"
                    className="inline-flex items-center gap-2 px-6 py-3"
                    style={{ backgroundColor: categoryTheme.main }}
                  >
                    <PlusCircle size={20} />
                    <span>Crear Primera Pregunta</span>
                  </Button>
                )}
                {questions.length > 0 && filteredQuestions.length === 0 && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setDifficultyFilter("all");
                    }}
                    variant="secondary"
                    className="inline-flex items-center gap-2 px-6 py-3"
                  >
                    <span>Limpiar Filtros</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
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
        message="¡Pregunta eliminada exitosamente!"
      />
    </div>
  );
}
