import { useEffect, useState } from 'react';

// Este es el componente visual de la "ventana emergente".
// No depende de Context, solo de las props que le pasemos.
export default function Notification({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  // Estilos base y por tipo (éxito, error, etc.)
  const baseStyles = "fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg text-white font-bold transition-all duration-300 ease-in-out";
  const typeStyles = {
    success: 'bg-green-500', // Verde para éxito
    error: 'bg-red-500',     // Rojo para error
  };

  // Este efecto controla la aparición y desaparición de la notificación.
  useEffect(() => {
    // Si llega un mensaje nuevo...
    if (message) {
      setVisible(true); // 1. La hacemos visible.

      // 2. Programamos un temporizador para ocultarla después de 3 segundos.
      const timer = setTimeout(() => {
        setVisible(false);
        // 3. Esperamos a que termine la animación de salida (300ms) para llamar a onClose.
        // onClose limpiará el mensaje en el componente padre.
        setTimeout(() => {
          onClose();
        }, 300); 
      }, 3000); // 3 segundos visible

      // Limpiamos el temporizador si el componente se desmonta o el mensaje cambia.
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  // Si no hay mensaje, no renderizamos nada.
  if (!message) {
    return null;
  }

  // Renderizamos el div con las clases y la animación de entrada/salida.
  return (
    <div 
      className={`${baseStyles} ${typeStyles[type]} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
    >
      {message}
    </div>
  );
}