// src/pages/teacher/TeacherQuestionFormPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Check, AlertCircle, ArrowLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import SuccessModal from "../../components/ui/SuccessModal";
import api from "../../api/axiosInstance";

const defaultFormState = {
  enunciado: "",
  pregunta: "",
  opciones: [
    { texto: "", esCorrecta: true },
    { texto: "", esCorrecta: false },
    { texto: "", esCorrecta: false },
    { texto: "", esCorrecta: false },
  ],
  aiGenerated: false,
  imagePath: null,
};

export default function TeacherQuestionFormPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(questionId);

  const initialData = isEditing ? location.state?.questionData : null;
  const returnPath = location.state?.from || "/teacher/categories";

  const [formData, setFormData] = useState(defaultFormState);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [aiError, setAiError] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Efecto para filtrar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory && subCategories.length > 0) {
      const filtered = subCategories.filter(
        (subcat) => subcat.category_id === selectedCategory
      );
      setFilteredSubCategories(filtered);

      // Limpiar la subcategoría seleccionada al cambiar de categoría
      setSelectedSubCategory("");

      // Si solo hay una subcategoría, seleccionarla automáticamente
      if (filtered.length === 1) {
        setSelectedSubCategory(filtered[0].sub_category_id);
      }
    } else {
      setFilteredSubCategories([]);
      setSelectedSubCategory("");
    }
  }, [selectedCategory, subCategories]);

  const handleCategoryChange = (categoryId) => {
    console.log("Categoría seleccionada:", categoryId);
    setSelectedCategory(categoryId);
  };

  // Función para regresar a la página anterior
  const handleGoBack = () => {
    navigate("/teacher/categories");
  };

  const handleCloseModalAndReturn = () => {
    setShowSuccessModal(false);
    navigate("/teacher/categories");
  };

  useEffect(() => {
    // Cargar categorías y subcategorías disponibles
    const loadCategoriesAndSubCategories = async () => {
      try {
        console.log("Cargando categorías y subcategorías...");

        // Cargar categorías
        const categoriesResponse = await api.get("/categories");
        console.log("Categorías cargadas:", categoriesResponse.data);
        setCategories(categoriesResponse.data || []);

        // Cargar subcategorías
        const subCategoriesResponse = await api.get("/categories/subcategories");
        console.log("Subcategorías cargadas:", subCategoriesResponse.data);
        setSubCategories(subCategoriesResponse.data || []);
      } catch (error) {
        console.error("Error cargando categorías y subcategorías:", error);
        setAiError("Error al cargar categorías y subcategorías");
      }
    };

    loadCategoriesAndSubCategories();

    if (isEditing && initialData) {
      console.log("Modo edición - datos iniciales:", initialData);

      const opciones = initialData.opciones || [];
      const opcionesNormalizadas = [...opciones];
      while (opcionesNormalizadas.length < 4) {
        opcionesNormalizadas.push({ texto: "", esCorrecta: false });
      }

      const fullStatement = initialData.enunciado || "";
      let enunciado = "";
      let pregunta = "";

      const patterns = [
        "Del texto anterior",
        "Según el texto",
        "De acuerdo al texto",
        "Con base en el texto",
        "A partir del texto",
      ];

      let preguntaStart = -1;
      for (const pattern of patterns) {
        preguntaStart = fullStatement.indexOf(pattern);
        if (preguntaStart !== -1) break;
      }

      if (preguntaStart !== -1) {
        enunciado = fullStatement.substring(0, preguntaStart).trim();
        pregunta = fullStatement.substring(preguntaStart).trim();
      } else {
        const paragraphs = fullStatement.split("\n\n");
        if (paragraphs.length > 1) {
          enunciado = paragraphs.slice(0, -1).join("\n\n").trim();
          pregunta = paragraphs[paragraphs.length - 1].trim();
        } else {
          pregunta = fullStatement;
        }
      }

      setFormData({
        enunciado: enunciado,
        pregunta: pregunta,
        opciones: opcionesNormalizadas.slice(0, 4),
        aiGenerated: false,
        imagePath: initialData.imagePath || null,
      });

      // Si estamos editando, también cargar la categoría y subcategoría
      if (initialData.selectedCategory) {
        setSelectedCategory(initialData.selectedCategory);
      }
      if (initialData.selectedSubCategory) {
        setSelectedSubCategory(initialData.selectedSubCategory);
      }
    } else {
      setFormData(defaultFormState);
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpcionChange = (index, value) => {
    const nuevasOpciones = [...formData.opciones];
    nuevasOpciones[index].texto = value;
    setFormData((prev) => ({ ...prev, opciones: nuevasOpciones }));
  };

  const handleSetRespuestaCorrecta = (index) => {
    const nuevasOpciones = formData.opciones.map((opcion, i) => ({
      ...opcion,
      esCorrecta: i === index,
    }));
    setFormData((prev) => ({ ...prev, opciones: nuevasOpciones }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=== INICIANDO SUBMIT ===");
    console.log("Form Data:", formData);
    console.log("Selected Category:", selectedCategory);
    console.log("Selected SubCategory:", selectedSubCategory);
    console.log("Is Editing:", isEditing);

    try {
      // Validaciones
      if (!isEditing) {
        if (!selectedCategory) {
          setAiError("Debe seleccionar una categoría");
          return;
        }
        if (!selectedSubCategory) {
          setAiError("Debe seleccionar una subcategoría");
          return;
        }
      }

      // Validar que hay al menos una respuesta correcta
      const hasCorrectAnswer = formData.opciones.some((opcion) => opcion.esCorrecta);
      if (!hasCorrectAnswer) {
        setAiError("Debe seleccionar al menos una respuesta correcta");
        return;
      }

      // Validar que no hay opciones vacías
      const hasEmptyOptions = formData.opciones.some((opcion) => !opcion.texto.trim());
      if (hasEmptyOptions) {
        setAiError("Todas las opciones deben tener texto");
        return;
      }

      // Validar pregunta
      if (!formData.pregunta.trim()) {
        setAiError("La pregunta es obligatoria");
        return;
      }

      setLoadingSave(true);
      setAiError("");

      // Construir el statement
      const statement = formData.enunciado
        ? `${formData.enunciado}\n\n${formData.pregunta}`
        : formData.pregunta;

      // Construir las respuestas
      const answers = formData.opciones.map((opcion, index) => ({
        option_text: opcion.texto.trim(),
        isCorrect: opcion.esCorrecta,
        order: index + 1,
      }));

      console.log("Statement construido:", statement);
      console.log("Answers construidas:", answers);

      const questionData = {
        statement: statement,
        questionType: "multiple_choice",
        imagePath: formData.imagePath,
        difficulty: "medium",
        justification: "Pregunta creada por profesor",
        status: "draft",
        answers: answers,
      };

      console.log("Question Data para enviar:", questionData);

      if (isEditing) {
        console.log("Actualizando pregunta existente...");
        const response = await api.put(`/questions/${questionId}`, questionData);
        console.log("Respuesta de actualización:", response);

        if (response.status === 200) {
          console.log("Pregunta actualizada exitosamente");
          setShowSuccessModal(true);
        }
      } else {
        console.log("Creando nueva pregunta...");

        const fullQuestionData = {
          ...questionData,
          subCategoryId: selectedSubCategory,
          creationDate: new Date().toISOString().slice(0, 19).replace("T", " "),
          aiGenerated: formData.aiGenerated || false,
        };

        console.log("Full Question Data para crear:", fullQuestionData);

        const response = await api.post("/questions/saveQuestion1", fullQuestionData);
        console.log("Respuesta de creación:", response);

        if (response.status === 201) {
          console.log("Pregunta creada exitosamente");
          setShowSuccessModal(true);
        }
      }
    } catch (error) {
      console.error("=== ERROR EN SUBMIT ===");
      console.error("Error completo:", error);
      console.error("Error response:", error.response);
      console.error("Error request:", error.request);
      console.error("Error message:", error.message);

      let errorMessage = "Error al guardar la pregunta";

      if (error.response) {
        console.error("Error de respuesta del servidor:", error.response.status, error.response.data);
        errorMessage = `Error ${error.response.status}: ${
          error.response.data?.message || error.response.data || "Error del servidor"
        }`;
      } else if (error.request) {
        console.error("Error de petición:", error.request);
        errorMessage = "Error de conexión. Verifica tu conexión a internet";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAiError(errorMessage);
    } finally {
      setLoadingSave(false);
      console.log("=== FIN SUBMIT ===");
    }
  };

  const generateWithAI = async () => {
    // Validar que se haya seleccionado categoría y subcategoría antes de generar
    if (!selectedCategory) {
      setAiError("Debe seleccionar una categoría antes de generar con IA");
      return;
    }

    if (!selectedSubCategory) {
      setAiError("Debe seleccionar una subcategoría antes de generar con IA");
      return;
    }

    setLoadingAI(true);
    setAiError("");

    try {
      // Obtener los nombres de la categoría y subcategoría seleccionadas
      const selectedCategoryData = categories.find(
        (cat) => cat.category_id === selectedCategory
      );
      const selectedSubCategoryData = filteredSubCategories.find(
        (sub) => sub.sub_category_id === selectedSubCategory
      );

      const categoryName =
        selectedCategoryData?.category_name || "Categoría General";
      const subCategoryName =
        selectedSubCategoryData?.sub_category_name || "Subcategoría General";

      console.log("Generando pregunta para:", {
        categoryName,
        subCategoryName,
      });

      const res = await api.post("/ai/generateQuestion", {
        topic: categoryName,
        subtopic: subCategoryName,
        difficulty: "medium",
        questionNumbers: 1,
      });

      if (res.data && res.data.questions) {
        const aiQuestion = res.data.questions;

        if (
          aiQuestion.statement &&
          aiQuestion.option_A &&
          aiQuestion.option_B &&
          aiQuestion.option_C &&
          aiQuestion.option_D &&
          aiQuestion.Correct_Answer
        ) {
          const opciones = [
            {
              texto: aiQuestion.option_A,
              esCorrecta: aiQuestion.Correct_Answer === "A",
            },
            {
              texto: aiQuestion.option_B,
              esCorrecta: aiQuestion.Correct_Answer === "B",
            },
            {
              texto: aiQuestion.option_C,
              esCorrecta: aiQuestion.Correct_Answer === "C",
            },
            {
              texto: aiQuestion.option_D,
              esCorrecta: aiQuestion.Correct_Answer === "D",
            },
          ];

          const fullStatement = aiQuestion.statement;
          let enunciado = "";
          let pregunta = "";

          // Buscar diferentes patrones comunes de separación
          const patterns = [
            "Del texto anterior",
            "Según el texto",
            "De acuerdo al texto",
            "Con base en el texto",
            "A partir del texto",
          ];

          let preguntaStart = -1;
          for (const pattern of patterns) {
            preguntaStart = fullStatement.indexOf(pattern);
            if (preguntaStart !== -1) break;
          }

          if (preguntaStart !== -1) {
            enunciado = fullStatement.substring(0, preguntaStart).trim();
            pregunta = fullStatement.substring(preguntaStart).trim();
          } else {
            // Si no encuentra un patrón, dividir por párrafos o usar todo como pregunta
            const paragraphs = fullStatement.split("\n\n");
            if (paragraphs.length > 1) {
              enunciado = paragraphs.slice(0, -1).join("\n\n").trim();
              pregunta = paragraphs[paragraphs.length - 1].trim();
            } else {
              pregunta = fullStatement;
            }
          }

          setFormData({
            enunciado: enunciado,
            pregunta: pregunta,
            opciones: opciones,
            aiGenerated: true,
          });
        } else {
          throw new Error("La respuesta de la IA no tiene la estructura esperada");
        }
      } else {
        throw new Error("No se recibieron preguntas de la IA");
      }
    } catch (error) {
      let errorMessage = "Error al generar pregunta con IA";

      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${
          error.response.data?.message ||
          error.response.data ||
          "Error del servidor"
        }`;
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet";
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Error en generateWithAI:", error);
      setAiError(errorMessage);
    } finally {
      setLoadingAI(false);
    }
  };

  // Verificar si se puede generar con IA
  const canGenerateWithAI = selectedCategory && selectedSubCategory;

  // Obtener el nombre de la categoría seleccionada para mostrar en el título
  const selectedCategoryName = categories.find(
    (cat) => cat.category_id === selectedCategory
  )?.category_name;

  // Función para renderizar el contenido de manera segura
  const renderContent = () => {
    try {
      return (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header con botón de regreso y título */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  onClick={handleGoBack}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                  <span>Regresar</span>
                </Button>
              </div>

              <div className="border-b border-gray-200 pb-4"></div>
            </div>

            {/* Mostrar error de IA si existe */}
            {aiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                <AlertCircle
                  className="text-red-500 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm mt-1">{aiError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel Izquierdo - Configuración y IA */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Categorías */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Configuración
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2">
                          Categoría *
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                          disabled={isEditing}
                        >
                          <option value="">Seleccionar categoría...</option>
                          {categories.map((category) => (
                            <option
                              key={category.category_id}
                              value={category.category_id}
                            >
                              {category.category_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2">
                          Subcategoría *
                        </label>
                        <select
                          value={selectedSubCategory}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                          required
                          disabled={isEditing || !selectedCategory}
                        >
                          <option value="">
                            {!selectedCategory
                              ? "Primero selecciona una categoría..."
                              : "Seleccionar subcategoría..."}
                          </option>
                          {filteredSubCategories.map((subcat) => (
                            <option
                              key={subcat.sub_category_id}
                              value={subcat.sub_category_id}
                            >
                              {subcat.sub_category_name}
                            </option>
                          ))}
                        </select>
                        {!selectedCategory && (
                          <p className="text-xs text-gray-500 mt-1">
                            Selecciona una categoría para ver las subcategorías
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Generador IA */}
                  {!isEditing && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Generar con IA
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {canGenerateWithAI
                            ? `Crear pregunta automática para ${
                                categories.find(
                                  (c) => c.category_id === selectedCategory
                                )?.category_name || "la categoría seleccionada"
                              }`
                            : "Selecciona categoría y subcategoría primero"}
                        </p>
                        <button
                          type="button"
                          onClick={generateWithAI}
                          disabled={loadingAI || !canGenerateWithAI}
                          className={`w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                            loadingAI || !canGenerateWithAI
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:from-green-600 hover:to-emerald-600 transform hover:scale-105"
                          }`}
                        >
                          <Sparkles
                            size={18}
                            className={loadingAI ? "animate-spin" : ""}
                          />
                          <span>
                            {loadingAI ? "Generando..." : "Generar con IA"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Panel Central y Derecho - Contenido */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contenido de la pregunta */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contenido de la Pregunta
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2">
                          Enunciado{" "}
                          <span className="text-gray-400 font-normal">
                            (Opcional)
                          </span>
                        </label>
                        <textarea
                          name="enunciado"
                          value={formData.enunciado || ""}
                          onChange={handleChange}
                          rows="4"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                          placeholder="El joven explorador, Marco, fue enviado..."
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2">
                          Pregunta *
                        </label>
                        <input
                          name="pregunta"
                          value={formData.pregunta || ""}
                          onChange={handleChange}
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="En el texto, ¿cuál de las siguientes opciones...?"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Opciones de respuesta */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Opciones de Respuesta
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.opciones && formData.opciones.map((opcion, index) => (
                        <div key={index} className="relative">
                          <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <input
                              type="text"
                              value={opcion?.texto || ""}
                              onChange={(e) =>
                                handleOpcionChange(index, e.target.value)
                              }
                              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={`Opción ${String.fromCharCode(
                                65 + index
                              )}`}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => handleSetRespuestaCorrecta(index)}
                              className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                                opcion?.esCorrecta
                                  ? "bg-green-600 text-white transform scale-110"
                                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                              }`}
                              title={
                                opcion?.esCorrecta
                                  ? "Respuesta correcta"
                                  : "Marcar como correcta"
                              }
                            >
                              <Check size={18} />
                            </button>
                          </div>
                          {opcion?.esCorrecta && (
                            <div className="absolute -top-1 -right-1">
                              <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-gray-500 mt-4 text-center flex items-center justify-center gap-1">
                      <span>Haz clic en el botón</span>
                      <Check size={14} className="inline" />
                      <span>para marcar la respuesta correcta</span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <Button
                        type="button"
                        variant="cancel"
                        onClick={handleGoBack}
                        className="sm:w-auto"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loadingSave}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 sm:w-auto"
                      >
                        {loadingSave
                          ? "Guardando..."
                          : isEditing
                          ? "Guardar Cambios"
                          : "Agregar Pregunta"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {showSuccessModal && (
              <SuccessModal
                show={showSuccessModal}
                onClose={handleCloseModalAndReturn}
                title={isEditing ? "Cambios Guardados" : "Pregunta Creada"}
                message={
                  isEditing
                    ? "La pregunta ha sido actualizada correctamente."
                    : "La nueva pregunta ha sido agregada."
                }
              />
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error renderizando componente:", error);
      return (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Error en la aplicación
              </h2>
              <p className="text-red-600">
                Ha ocurrido un error inesperado. Por favor, recarga la página.
              </p>
              <p className="text-red-600 text-sm mt-2">
                Error: {error.message}
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  return renderContent();
}
