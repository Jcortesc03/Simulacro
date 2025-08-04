// src/components/ui/Modal.jsx

import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleModalContentClick = (e) => e.stopPropagation();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      {/* --- ¡CAMBIO CLAVE! ---
          Añadimos 'flex flex-col' para que sus hijos puedan usar flex-grow.
          'overflow-hidden' evita que el propio modal tenga scroll.
          'max-h-[90vh]' limita la altura máxima del modal.
      */}
      <div
        onClick={handleModalContentClick}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto flex flex-col max-h-[90vh] overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;