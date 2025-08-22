// src/components/ui/SuccessModal.jsx

import React from 'react';
import { CheckCircle2, Info } from 'lucide-react'; // Usaremos un ícono más apropiado
import Button from './Button';

// Ahora el modal acepta 'title' y 'variant' para ser más flexible
const SuccessModal = ({ show, onClose, title = "¡Éxito!", message, variant = 'success' }) => {
  if (!show) {
    return null;
  }

  const isSuccess = variant === 'success';
  const IconComponent = isSuccess ? CheckCircle2 : Info;
  const iconColor = isSuccess ? 'text-green-500' : 'text-blue-500';

  return (
    // --- CAMBIO CLAVE --- Usamos el mismo overlay oscuro que ConfirmationModal
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all animate-fade-in-up text-center">
        
        <IconComponent className={`mx-auto h-16 w-16 ${iconColor} mb-4`} />

        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-md text-gray-600 mb-8">{message}</p>
        
        <Button onClick={onClose} variant="primary" className="bg-blue-600">
          Aceptar
        </Button>
      </div>
    </div>
  );
};

export default SuccessModal;