// src/components/ui/ConfirmationModal.jsx

import React from 'react';
import Button from './Button';
import { AlertTriangle, HelpCircle } from 'lucide-react';

const ConfirmationModal = ({
  show,
  onClose,
  onConfirm,
  title = "Confirmación",
  message = "¿Estás seguro?",
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  variant = "danger",
  children // --- ¡NUEVO! --- Prop para contenido extra
}) => {
  if (!show) {
    return null;
  }

  const isDanger = variant === 'danger';
  const IconComponent = isDanger ? AlertTriangle : HelpCircle;
  const iconColor = isDanger ? 'text-red-500' : 'text-blue-500';
  const confirmButtonVariant = isDanger ? 'danger' : 'ghost';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all animate-fade-in-up">
        <div className="text-center">
          <IconComponent className={`mx-auto h-16 w-16 ${iconColor} mb-4`} />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-md text-gray-600 mb-6">{message}</p>
          
          {/* --- ¡NUEVO! --- Renderiza el contenido extra si existe */}
          {children && <div className="mb-8">{children}</div>}
          
        </div>
        <div className="flex flex-col sm:flex-row-reverse gap-3">
          <Button onClick={onConfirm} variant={confirmButtonVariant} className="w-full sm:w-auto">
            {confirmText}
          </Button>
          <Button onClick={onClose} variant="cancel" className="w-full sm:w-auto bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800">
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;