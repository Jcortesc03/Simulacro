// src/components/questions/QuestionCard.jsx
import React from "react";
import Button from "../ui/Button";
import { Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function QuestionCard({ question, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header con enunciado */}
      <div className="p-6 pb-4">
        <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {question.enunciado}
        </h3>
      </div>

      {/* Imagen si existe */}
      {question.imagePath && (
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <img
              src={question.imagePath}
              alt="Ilustración de la pregunta"
              className="max-w-full h-auto rounded-md shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Opciones */}
      <div className="px-6 pb-4">
        <div className="space-y-3">
          {question.opciones.map((opcion, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-colors duration-150 ${
                opcion.esCorrecta
                  ? 'bg-green-50 border-green-200 hover:bg-green-100'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {/* Letra de opción */}
              <span className="flex-shrink-0 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                {String.fromCharCode(65 + index)}
              </span>

              {/* Texto de la opción */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-gray-800 leading-relaxed block"
                  dangerouslySetInnerHTML={{ __html: opcion.texto }}
                />
              </div>

              {/* Indicador de respuesta correcta */}
              <div className="flex-shrink-0">
                {opcion.esCorrecta ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer con metadata y botones */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        {/* Información de la pregunta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Dificultad:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                question.dificultad === 'Fácil' ? 'bg-green-100 text-green-800' :
                question.dificultad === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.dificultad}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Editado por:</span>
              <span className="text-gray-800">{question.editadoPor}</span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        {(onEdit || onDelete) && (
          <div className="flex gap-3">
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="secondary"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={onDelete}
                variant="danger"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
