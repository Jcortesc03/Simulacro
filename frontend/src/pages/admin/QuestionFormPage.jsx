import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Check, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import SuccessModal from '../../components/ui/SuccessModal';
import api from '../../api/axiosInstance';

const defaultFormState = {
  enunciado: '',
  pregunta: '',
  opciones: [
    { texto: '', esCorrecta: true }, { texto: '', esCorrecta: false },
    { texto: '', esCorrecta: false }, { texto: '', esCorrecta: false },
  ],
  aiGenerated: false
};

export default function QuestionFormPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(questionId);

  const initialData = isEditing ? location.state?.questionData : null;
  const returnPath = location.state?.from || '/admin/categories';

  const [formData, setFormData] = useState(defaultFormState);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [aiError, setAiError] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  // Efecto para filtrar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory && subCategories.length > 0) {
      const filtered = subCategories.filter(
        subcat => subcat.category_id === selectedCategory
      );
      setFilteredSubCategories(filtered);

      // Limpiar la subcategoría seleccionada al cambiar de categoría
      setSelectedSubCategory('');

      // Si solo hay una subcategoría, seleccionarla automáticamente
      if (filtered.length === 1) {
        setSelectedSubCategory(filtered[0].sub_category_id);
      }
    } else {
      setFilteredSubCategories([]);
      setSelectedSubCategory('');
    }
  }, [selectedCategory, subCategories]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  useEffect(() => {
    // Cargar categorías y subcategorías disponibles
    const loadCategoriesAndSubCategories = async () => {
      try {
        // Cargar categorías
        const categoriesResponse = await api.get('/admin/getCategories');
        setCategories(categoriesResponse.data || []);

        // Cargar subcategorías
        const subCategoriesResponse = await api.get('/admin/subcategories');
        setSubCategories(subCategoriesResponse.data || []);
      } catch (error) {
        console.error('Error cargando categorías y subcategorías:', error);
      }
    };

    loadCategoriesAndSubCategories();

    if (isEditing && initialData) {
      const opciones = initialData.opciones || [];
      const opcionesNormalizadas = [...opciones];
      while (opcionesNormalizadas.length < 4) {
        opcionesNormalizadas.push({ texto: '', esCorrecta: false });
      }
      setFormData({
        enunciado: initialData.enunciado || '',
        pregunta: initialData.pregunta || '',
        opciones: opcionesNormalizadas.slice(0, 4),
        aiGenerated: false
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpcionChange = (index, value) => {
    const nuevasOpciones = [...formData.opciones];
    nuevasOpciones[index].texto = value;
    setFormData(prev => ({ ...prev, opciones: nuevasOpciones }));
  };

  const handleSetRespuestaCorrecta = (index) => {
    const nuevasOpciones = formData.opciones.map((opcion, i) => ({ ...opcion, esCorrecta: i === index }));
    setFormData(prev => ({ ...prev, opciones: nuevasOpciones }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se haya seleccionado una categoría
    if (!selectedCategory) {
      setAiError('Debe seleccionar una categoría');
      return;
    }

    // Validar que se haya seleccionado una subcategoría
    if (!selectedSubCategory) {
      setAiError('Debe seleccionar una subcategoría');
      return;
    }

    // Validar que hay al menos una respuesta correcta
    const hasCorrectAnswer = formData.opciones.some(opcion => opcion.esCorrecta);
    if (!hasCorrectAnswer) {
      setAiError('Debe seleccionar al menos una respuesta correcta');
      return;
    }

    // Validar que todas las opciones tengan texto
    const hasEmptyOptions = formData.opciones.some(opcion => !opcion.texto.trim());
    if (hasEmptyOptions) {
      setAiError('Todas las opciones deben tener texto');
      return;
    }

    setLoadingSave(true);
    setAiError('');

    try {
      // Preparar el statement completo
      const statement = formData.enunciado
        ? `${formData.enunciado}\n\n${formData.pregunta}`
        : formData.pregunta;

      // Preparar las respuestas en el formato que espera el backend
      const answers = formData.opciones.map((opcion, index) => ({
        option_text: opcion.texto,
        isCorrect: opcion.esCorrecta,
        order: index + 1
      }));

      // Datos para enviar al backend
      const questionData = {
        subCategoryId: selectedSubCategory,
        statement: statement,
        questionType: 'multiple_choice',
        imagePath: null,
        creationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        aiGenerated: formData.aiGenerated || false,
        difficulty: 'medium',
        justification: 'Pregunta creada manualmente',
        status: 'draft',
        answers: answers
      };

      console.log("Enviando pregunta:", questionData);

      const response = await api.post('/questions/saveQuestion', questionData);

      if (response.status === 201) {
        setShowSuccessModal(true);
      }

    } catch (error) {
      console.error('Error al guardar pregunta:', error);

      let errorMessage = 'Error al guardar la pregunta';
      if (error.response) {
        errorMessage = error.response.data || errorMessage;
      } else if (error.request) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet';
      }

      setAiError(errorMessage);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleCloseModalAndReturn = () => {
    setShowSuccessModal(false);
    navigate(returnPath);
  };

  const generateWithAI = async () => {
    // Validar que se haya seleccionado categoría y subcategoría antes de generar
    if (!selectedCategory) {
      setAiError('Debe seleccionar una categoría antes de generar con IA');
      return;
    }

    if (!selectedSubCategory) {
      setAiError('Debe seleccionar una subcategoría antes de generar con IA');
      return;
    }

    setLoadingAI(true);
    setAiError('');

    try {
      // Obtener los nombres de la categoría y subcategoría seleccionadas
      const selectedCategoryData = categories.find(cat => cat.category_id === selectedCategory);
      const selectedSubCategoryData = filteredSubCategories.find(sub => sub.sub_category_id === selectedSubCategory);

      const categoryName = selectedCategoryData?.category_name || 'Categoría General';
      const subCategoryName = selectedSubCategoryData?.sub_category_name || 'Subcategoría General';

      console.log('Generando pregunta para:', { categoryName, subCategoryName });

      const res = await api.post('/ai/generateQuestion', {
        topic: categoryName, // Usar el nombre de la categoría seleccionada
        subtopic: subCategoryName, // Usar el nombre de la subcategoría seleccionada
        difficulty: "medium",
        questionNumbers: 1
      });

      if (res.data && res.data.questions) {
        const aiQuestion = res.data.questions;

        if (aiQuestion.statement && aiQuestion.option_A && aiQuestion.option_B && aiQuestion.option_C && aiQuestion.option_D && aiQuestion.Correct_Answer) {
          const opciones = [
            {
              texto: aiQuestion.option_A,
              esCorrecta: aiQuestion.Correct_Answer === 'A'
            },
            {
              texto: aiQuestion.option_B,
              esCorrecta: aiQuestion.Correct_Answer === 'B'
            },
            {
              texto: aiQuestion.option_C,
              esCorrecta: aiQuestion.Correct_Answer === 'C'
            },
            {
              texto: aiQuestion.option_D,
              esCorrecta: aiQuestion.Correct_Answer === 'D'
            }
          ];

          const fullStatement = aiQuestion.statement;
          let enunciado = '';
          let pregunta = '';

          // Buscar diferentes patrones comunes de separación
          const patterns = [
            'Del texto anterior',
            'Según el texto',
            'De acuerdo al texto',
            'Con base en el texto',
            'A partir del texto'
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
            const paragraphs = fullStatement.split('\n\n');
            if (paragraphs.length > 1) {
              enunciado = paragraphs.slice(0, -1).join('\n\n').trim();
              pregunta = paragraphs[paragraphs.length - 1].trim();
            } else {
              pregunta = fullStatement;
            }
          }

          setFormData({
            enunciado: enunciado,
            pregunta: pregunta,
            opciones: opciones,
            aiGenerated: true
          });

        } else {
          throw new Error('La respuesta de la IA no tiene la estructura esperada');
        }
      } else {
        throw new Error('No se recibieron preguntas de la IA');
      }

    } catch (error) {
      let errorMessage = 'Error al generar pregunta con IA';

      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data?.message || error.response.data || 'Error del servidor'}`;
      } else if (error.request) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet';
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error('Error en generateWithAI:', error);
      setAiError(errorMessage);
    } finally {
      setLoadingAI(false);
    }
  };

  // Verificar si se puede generar con IA
  const canGenerateWithAI = selectedCategory && selectedSubCategory;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Mostrar error de IA si existe */}
        {aiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar categoría...</option>
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                      required
                      disabled={!selectedCategory}
                    >
                      <option value="">
                        {!selectedCategory ? 'Primero selecciona una categoría...' : 'Seleccionar subcategoría...'}
                      </option>
                      {filteredSubCategories.map((subcat) => (
                        <option key={subcat.sub_category_id} value={subcat.sub_category_id}>
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
                    <div className="mx-auto h-12 w-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Generar con IA</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {canGenerateWithAI
                        ? `Crear pregunta automática para ${categories.find(c => c.category_id === selectedCategory)?.category_name}`
                        : 'Selecciona categoría y subcategoría primero'
                      }
                    </p>
                    <button
                      type="button"
                      onClick={generateWithAI}
                      disabled={loadingAI || !canGenerateWithAI}
                      className={`w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                        loadingAI || !canGenerateWithAI
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:from-purple-600 hover:to-blue-600 transform hover:scale-105'
                      }`}
                    >
                      <Sparkles size={18} className={loadingAI ? 'animate-spin' : ''} />
                      <span>{loadingAI ? 'Generando...' : 'Generar con IA'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Panel Central y Derecho - Contenido */}
            <div className="lg:col-span-2 space-y-6">

              {/* Contenido de la pregunta */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido de la Pregunta</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Enunciado <span className="text-gray-400 font-normal">(Opcional)</span>
                    </label>
                    <textarea
                      name="enunciado"
                      value={formData.enunciado}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      placeholder="El joven explorador, Marco, fue enviado..."
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Pregunta *
                    </label>
                    <input
                      name="pregunta"
                      value={formData.pregunta}
                      onChange={handleChange}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="En el texto, ¿cuál de las siguientes opciones...?"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Opciones de respuesta */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones de Respuesta</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.opciones.map((opcion, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          value={opcion.texto}
                          onChange={(e) => handleOpcionChange(index, e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleSetRespuestaCorrecta(index)}
                          className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                            opcion.esCorrecta
                              ? 'bg-green-600 text-white transform scale-110'
                              : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                          }`}
                          title={opcion.esCorrecta ? 'Respuesta correcta' : 'Marcar como correcta'}
                        >
                          <Check size={18} />
                        </button>
                      </div>
                      {opcion.esCorrecta && (
                        <div className="absolute -top-1 -right-1">
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500 mt-4 text-center">
                  Haz clic en el botón <Check size={14} className="inline mx-1" /> para marcar la respuesta correcta
                </p>
              </div>

              {/* Botones de acción */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    type="button"
                    variant="cancel"
                    onClick={() => navigate(returnPath)}
                    className="sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loadingSave}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                  >
                    {loadingSave ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Agregar Pregunta')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <SuccessModal
          show={showSuccessModal}
          onClose={handleCloseModalAndReturn}
          title={isEditing ? 'Cambios Guardados' : 'Pregunta Creada'}
          message={isEditing ? 'La pregunta ha sido actualizada correctamente.' : 'La nueva pregunta ha sido agregada.'}
        />
      </div>
    </div>
  );
}
