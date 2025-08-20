// src/components/questions/QuestionCard.jsx

import { Check, Edit, Trash2 } from 'lucide-react';

const QuestionCard = ({ question, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow">
      <div className="flex-grow">
        <p className="font-semibold text-gray-800 mb-4 text-lg">{question.pregunta}</p>
        <div className="space-y-3 text-gray-700">
          {question.opciones.map((opcion, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 flex justify-center">
                {opcion.esCorrecta && <Check className="text-green-600 font-bold" size={20} />}
              </div>
              <span>{opcion.texto}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 w-full md:w-52 flex flex-row-reverse md:flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
        <div className="text-right">
          <p className="text-xs text-gray-400">Nivel de dificultad</p>
          <p className="font-bold text-gray-800 text-lg mb-3">{question.dificultad}</p>
          <p className="text-xs text-gray-400">Editado por</p>
          <p className="font-bold text-gray-800 text-lg">{question.editadoPor}</p>
        </div>

        {/* ✅ Solo muestra el contenedor si hay al menos una acción */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button 
                onClick={onEdit} 
                className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors" 
                title="Editar"
              >
                <Edit size={20} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={onDelete} 
                className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors" 
                title="Eliminar"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;