import { useState, useEffect } from 'react';
import { Sparkles, Check } from 'lucide-react';

export default function QuestionForm({ initialData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    enunciado: '',
    pregunta: '',
    opciones: [
      { texto: '', esCorrecta: true },
      { texto: '', esCorrecta: false },
      { texto: '', esCorrecta: false },
      { texto: '', esCorrecta: false },
    ],
    categoria: 'Lectura Crítica',
    subcategoria: 'Literal'
  });

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
       const dataToEdit = { ...initialData };
    const opcionesExistentes = dataToEdit.opciones || [];
    const opcionesNormalizadas = [...opcionesExistentes];
    
    while (opcionesNormalizadas.length < 4) {
      opcionesNormalizadas.push({ texto: '', esCorrecta: false });
    }

    dataToEdit.opciones = opcionesNormalizadas;
    
    // Ahora solo llamamos a setFormData UNA VEZ con los datos corregidos.
    setFormData(dataToEdit); 
    } else {
      // Si es para añadir, reseteamos el formulario a su estado inicial
      setFormData({
        enunciado: '',
        pregunta: '',
        opciones: [
          { texto: '', esCorrecta: true }, { texto: '', esCorrecta: false },
          { texto: '', esCorrecta: false }, { texto: '', esCorrecta: false },
        ],
        categoria: 'Lectura Crítica',
        subcategoria: 'Literal'
      });
    }
  }, [initialData]);

  // Funciones para manejar cambios en el formulario
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
    onClose();
  };

  return (
    <div>
      {/* Cabecera del formulario con padding responsive */}
      <div className="p-4 sm:p-6 border-b">
        {/* Tamaño de texto responsive */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 ">{isEditing ? "Editar Pregunta" : "Agregar Pregunta"}</h2>
      </div>

      {/* Cuerpo del formulario con padding responsive y scroll */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto">
        
        <div>
          <label className="font-semibold text-gray-700">Enunciado <span className="text-gray-400 font-normal">(Opcional)</span></label>
          <textarea
            name="enunciado" value={formData.enunciado} onChange={handleChange}
            rows="4"
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
            placeholder="El joven explorador, Marco, fue enviado..."
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Pregunta</label>
          <input
            name="pregunta" value={formData.pregunta} onChange={handleChange}
            type="text"
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
            placeholder="En el texto, ¿cuál de las siguientes opciones...?"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Respuestas</label>
          <div className="space-y-3 mt-1">
            {formData.opciones.map((opcion, index) => (
              // En móvil, el input y el botón de check se apilan si no caben
              <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <input
                  type="text" value={opcion.texto} onChange={(e) => handleOpcionChange(index, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder={`Opción ${index + 1}`}
                />
                <button
                  type="button" onClick={() => handleSetRespuestaCorrecta(index)}
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
        
        {/* El grid ya es responsive, se mantiene igual */}
       
        {/* --- SECCIÓN DE BOTONES CON RESPONSIVE MEJORADO --- */}
        {/* Sigue siendo una columna invertida en móvil y una fila en desktop */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3 sm:gap-4 pt-4 border-t mt-6">
          <button type="button" onClick={onClose} className="w-full sm:w-auto flex-shrink-0 bg-brand-blue text-black rounded-lg h-12 px-4 flex items-center justify-center font-semibold hover:bg-red-700 hover:text-white transition-all duration-200">
            Cancelar
          </button>
          <button type="submit" className="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-brand-gray text-black rounded-lg h-12 flex items-center justify-center font-semibold hover:bg-blue-700 hover:text-white transition-all duration-200">
            {isEditing ? 'Guardar Cambios' : 'Aceptar'}
          </button>
          {!isEditing && (
            <button type="button" className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base">
              <Sparkles size={18} />
              <span>Generar con IA</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}