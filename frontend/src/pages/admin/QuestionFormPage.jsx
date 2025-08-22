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
  const [aiError, setAiError] = useState('');

  // Log para verificar que el componente se renderiza
  console.log('🔄 Admin QuestionFormPage renderizado');
  console.log('📊 Props:', { questionId, isEditing, loadingAI });

  useEffect(() => {
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
      });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Guardando pregunta (Admin):", formData);
    setShowSuccessModal(true);
  };

  const handleCloseModalAndReturn = () => {
    setShowSuccessModal(false);
    navigate(returnPath);
  };

  const generateWithAI = async () => {
    console.log('🎯 ADMIN - BOTÓN IA CLICKED - generateWithAI ejecutándose');
    setLoadingAI(true);
    setAiError('');

    try {
      console.log('🚀 [ADMIN] Iniciando generación con IA...');
      console.log('📡 [ADMIN] Enviando request a:', '/ai/generateQuestion');
      console.log('📋 [ADMIN] Parámetros:', {
        topic: "Lectura Crítica",
        subtopic: "Inferencial",
        difficulty: "medium",
        questionNumbers: 1
      });

      const res = await api.post('/ai/generateQuestion', {
        topic: "Lectura Crítica",
        subtopic: "Inferencial",
        difficulty: "medium",
        questionNumbers: 1
      });

      console.log('✅ [ADMIN] Respuesta recibida:', res);
      console.log('📄 [ADMIN] Data de respuesta:', res.data);
      console.log('🔢 [ADMIN] Status:', res.status);

      // La nueva estructura de la respuesta
      if (res.data && res.data.questions) {
        console.log('✅ [ADMIN] Estructura válida encontrada');
        const aiQuestion = res.data.questions;
        console.log('📝 [ADMIN] Datos de pregunta:', aiQuestion);

        // Validar que la pregunta tenga la estructura correcta
        if (aiQuestion.statement && aiQuestion.option_A && aiQuestion.option_B && aiQuestion.option_C && aiQuestion.option_D && aiQuestion.Correct_Answer) {
          console.log('✅ [ADMIN] Pregunta y opciones válidas');
          console.log('❓ [ADMIN] Statement:', aiQuestion.statement);
          console.log('🅰️ [ADMIN] Option A:', aiQuestion.option_A);
          console.log('🅱️ [ADMIN] Option B:', aiQuestion.option_B);
          console.log('🅾️ [ADMIN] Option C:', aiQuestion.option_C);
          console.log('🆔 [ADMIN] Option D:', aiQuestion.option_D);
          console.log('✅ [ADMIN] Correct Answer:', aiQuestion.Correct_Answer);

          // Crear las opciones basadas en la respuesta de la API
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

          console.log('🔧 [ADMIN] Opciones procesadas:', opciones);

          // Extraer enunciado y pregunta del statement
          const fullStatement = aiQuestion.statement;
          let enunciado = '';
          let pregunta = '';

          // Buscar donde termina el enunciado y empieza la pregunta
          // Generalmente la pregunta empieza con "Del texto anterior..." o similar
          const preguntaStart = fullStatement.indexOf('Del texto anterior');
          if (preguntaStart !== -1) {
            enunciado = fullStatement.substring(0, preguntaStart).trim();
            pregunta = fullStatement.substring(preguntaStart).trim();
          } else {
            // Si no encuentra el patrón, usar todo como pregunta
            pregunta = fullStatement;
          }

          const newFormData = {
            enunciado: enunciado,
            pregunta: pregunta,
            opciones: opciones
          };

          console.log('📋 [ADMIN] Nuevo formData a establecer:', newFormData);
          setFormData(newFormData);

          console.log('🎉 [ADMIN] Pregunta generada exitosamente');
        } else {
          console.error('❌ [ADMIN] Estructura de pregunta inválida:', aiQuestion);
          throw new Error('La respuesta de la IA no tiene la estructura esperada');
        }
      } else {
        console.error('❌ [ADMIN] No se encontraron preguntas en la respuesta:', res.data);
        throw new Error('No se recibieron preguntas de la IA');
      }

    } catch (error) {
      console.error('🚨 [ADMIN] ERROR COMPLETO:', error);
      console.error('🔍 [ADMIN] Error.message:', error.message);
      console.error('🌐 [ADMIN] Error.response:', error.response);
      console.error('📡 [ADMIN] Error.request:', error.request);

      let errorMessage = 'Error al generar pregunta con IA';

      if (error.response) {
        // Error del servidor
        console.error('❌ [ADMIN] Error del servidor - Status:', error.response.status);
        console.error('📄 [ADMIN] Error del servidor - Data:', error.response.data);
        errorMessage = `Error ${error.response.status}: ${error.response.data?.message || error.response.data || 'Error del servidor'}`;
      } else if (error.request) {
        // Error de red
        console.error('🌐 [ADMIN] Error de red:', error.request);
        errorMessage = 'Error de conexión. Verifica tu conexión a internet';
      } else if (error.message) {
        // Error de lógica
        console.error('⚠️ [ADMIN] Error de lógica:', error.message);
        errorMessage = error.message;
      }

      console.error('📢 [ADMIN] Mensaje final de error:', errorMessage);
      setAiError(errorMessage);

      // También mostrar el error en un alert para el usuario
      alert(errorMessage);
    } finally {
      console.log('🏁 [ADMIN] Finalizando generateWithAI - loadingAI = false');
      setLoadingAI(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      {/* Debug info */}
      <div className="bg-blue-100 p-2 text-xs mb-4 rounded">
        <p>🔍 [ADMIN] DEBUG: isEditing = {String(isEditing)}, loadingAI = {String(loadingAI)}</p>
        <p>📊 [ADMIN] Botón IA visible: {String(!isEditing)}</p>
        <p>🚨 [ADMIN] Botón IA habilitado: {String(!loadingAI)}</p>
        <button
          onClick={() => {
            console.log('🧪 [ADMIN] TEST: Botón de prueba clickeado');
            alert('¡Botón de prueba ADMIN funciona!');
          }}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs mt-1"
        >
          BOTÓN DE PRUEBA ADMIN
        </button>
      </div>

      {/* Mostrar error de IA si existe */}
      {aiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-800 font-medium">Error al generar pregunta</p>
            <p className="text-red-600 text-sm mt-1">{aiError}</p>
          </div>
        </div>
      )}

      <form id="admin-question-form" onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-semibold text-gray-700">Enunciado <span className="text-gray-400 font-normal">(Opcional)</span></label>
          <textarea
            name="enunciado"
            value={formData.enunciado}
            onChange={handleChange}
            rows="5"
            className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="El joven explorador, Marco, fue enviado..."
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Pregunta</label>
          <input
            name="pregunta"
            value={formData.pregunta}
            onChange={handleChange}
            type="text"
            className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="En el texto, ¿cuál de las siguientes opciones...?"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Respuestas</label>
          <div className="space-y-3 mt-1">
            {formData.opciones.map((opcion, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opcion.texto}
                  onChange={(e) => handleOpcionChange(index, e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={`Opción ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleSetRespuestaCorrecta(index)}
                  className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
                    opcion.esCorrecta ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-green-200'
                  }`}
                  title="Marcar como correcta"
                >
                  <Check size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button type="button" variant="cancel" onClick={() => navigate(returnPath)}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="bg-blue-600">
            {isEditing ? 'Guardar Cambios' : 'Agregar Pregunta'}
          </Button>

          {!isEditing && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ [ADMIN] CLICK EVENT en botón IA:', e);
                console.log('🎯 [ADMIN] Target:', e.target);
                console.log('🚨 [ADMIN] LoadingAI antes del click:', loadingAI);
                console.log('⚡ [ADMIN] isEditing:', isEditing);
                console.log('🔥 [ADMIN] Llamando generateWithAI...');
                generateWithAI();
              }}
              disabled={loadingAI}
              className={`w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-lg transform hover:scale-105 transition-all ${
                loadingAI ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <Sparkles size={18} className={loadingAI ? 'animate-spin' : ''} />
              <span>{loadingAI ? 'Generando...' : 'Generar con IA'}</span>
            </button>
          )}
        </div>
      </form>

      <SuccessModal
        show={showSuccessModal}
        onClose={handleCloseModalAndReturn}
        title={isEditing ? '¡Éxito!' : '¡Pregunta Creada!'}
        message={isEditing ? 'La pregunta ha sido actualizada correctamente.' : 'La nueva pregunta ha sido agregada al banco.'}
      />
    </div>
  );
}
