// src/pages/teacher/TeacherQuestionFormPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import SuccessModal from '../../components/ui/SuccessModal';

// Estado inicial por defecto para el formulario
const defaultFormState = {
  enunciado: '',
  pregunta: '',
  opciones: [
    { texto: '', esCorrecta: true }, { texto: '', esCorrecta: false },
    { texto: '', esCorrecta: false }, { texto: '', esCorrecta: false },
  ],
};

export default function TeacherQuestionFormPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(questionId);

  const initialData = isEditing ? location.state?.questionData : null;
  const returnPath = location.state?.from || '/teacher/categories';

  const [formData, setFormData] = useState(defaultFormState);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    console.log("Guardando pregunta (Profesor):", formData);
    setShowSuccessModal(true);
  };
  
  const handleCloseModalAndReturn = () => {
    setShowSuccessModal(false);
    navigate(returnPath);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      {/* El título ahora viene del Layout, así que lo quitamos de aquí */}
      <form id="teacher-question-form" onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-semibold text-gray-700">Enunciado <span className="text-gray-400 font-normal">(Opcional)</span></label>
          <textarea name="enunciado" value={formData.enunciado} onChange={handleChange} rows="5" className="mt-1 w-full p-3 border rounded-lg" placeholder="El joven explorador..."/>
        </div>
        <div>
          <label className="font-semibold text-gray-700">Pregunta</label>
          <input name="pregunta" value={formData.pregunta} onChange={handleChange} type="text" className="mt-1 w-full p-3 border rounded-lg" placeholder="En el texto, ¿cuál...?"/>
        </div>
        <div>
          <label className="font-semibold text-gray-700">Respuestas</label>
          <div className="space-y-3 mt-1">
            {formData.opciones.map((opcion, index) => (
              <div key={index} className="flex items-center gap-2">
                <input type="text" value={opcion.texto} onChange={(e) => handleOpcionChange(index, e.target.value)} className="w-full p-3 border rounded-lg" placeholder={`Opción ${index + 1}`}/>
                <button type="button" onClick={() => handleSetRespuestaCorrecta(index)} className={`flex-shrink-0 p-3 rounded-lg transition-colors ${opcion.esCorrecta ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-green-200'}`} title="Marcar como correcta">
                  <Check size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button type="button" variant="cancel" onClick={() => navigate(returnPath)}>Cancelar</Button>
          <Button type="submit" variant="primary" className="bg-blue-600">{isEditing ? 'Guardar Cambios' : 'Agregar Pregunta'}</Button>
          {!isEditing && (
            <button type="button" className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg flex items-center justify-center gap-2">
              <Sparkles size={18} />
              <span>Generar con IA</span>
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