import { useEffect } from 'react';

const SuccessModal = ({ show, onClose, message }) => {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  if (!show) return null;

  // Manejar clic en el backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-8 mx-4 max-w-md w-full transform transition-transform duration-300 scale-100 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícono de éxito */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Mensaje */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            ¡Éxito!
          </h3>
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        {/* Botón de cerrar */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Aceptar
          </button>
        </div>

        {/* Botón X en la esquina */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;
