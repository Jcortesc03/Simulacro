// src/components/questions/QuestionFormPage.jsx

import { useState, useEffect } from 'react';
import { Sparkles, Check } from 'lucide-react';
import Button from '../ui/Button';

// Estado inicial por defecto para el formulario
const defaultFormState = {
  enunciado: '',
  pregunta: '',
  opciones: [
    { texto: '', esCorrecta: true },
    { texto: '', esCorrecta: false },
    { texto: '', esCorrecta: false },
    { texto: '', esCorrecta: false },
  ],
};

export default function QuestionForm({ initialData, onClose, onSave }) {
  const [formData, setFormData] = useState(defaultFormState);
  const isEditing = Boolean(initialData);

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
      // Si no estamos editando, nos aseguramos de resetear al estado por defecto
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
    const nuevasOpciones = formData.opciones.map((opcion, i) => ({
      ...opcion,
      esCorrecta: i === index,
    }));
    setFormData(prev => ({ ...prev, opciones: nuevasOpciones }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // onClose(); // Es mejor que el componente padre decida si cerrar el modal
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* 1. Cabecera Fija */}
      <div className="p-4 sm:p-6 border-b flex-shrink-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {isEditing ? "Editar Pregunta" : "Agregar Pregunta"}
        </h2>
      </div>

      {/* 2. Cuerpo del Formulario (Con Scroll) */}
      <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-grow">
        <form id="question-form" onSubmit={handleSubmit}>
          <div>
            <label className="font-semibold text-gray-700">Enunciado <span className="text-gray-400 font-normal">(Opcional)</span></label>
            <textarea name="enunciado" value={formData.enunciado} onChange={handleChange} rows="4" className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="El joven explorador, Marco, fue enviado..."/>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Pregunta</label>
            <input name="pregunta" value={formData.pregunta} onChange={handleChange} type="text" className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="En el texto, ¿cuál de las siguientes opciones...?"/>
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
        </form>
      </div>
      
      {/* 3. Pie de Página Fijo */}
      <div className="p-4 sm:p-6 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-3 flex-shrink-0 bg-gray-50">
        <Button type="button" variant="cancel" onClick={onClose}>Cancelar</Button>
        
        {/* Este botón ahora envía el formulario por su 'form' id */}
        <Button type="submit" form="question-form" variant="primary" className="bg-blue-600">
          {isEditing ? 'Guardar Cambios' : 'Agregar Pregunta'}
        </Button>

        {!isEditing && (
          <button type="button" className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg flex items-center justify-center gap-2">
            <Sparkles size={18} />
            <span>Generar con IA</span>
          </button>
        )}
      </div>
    </div>
  );
}