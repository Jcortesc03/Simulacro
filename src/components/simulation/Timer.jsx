// src/components/simulation/Timer.jsx

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ initialMinutes = 40, onTimeUp }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    // Si el tiempo ya se acabó, no hacemos nada.
    if (seconds <= 0) {
      // Llamamos a la función onTimeUp solo una vez.
      if (onTimeUp) onTimeUp();
      return;
    }

    // Creamos un intervalo que descuenta un segundo.
    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    // Limpiamos el intervalo cuando el componente se desmonta.
    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  // Función para formatear el tiempo en MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // --- LÓGICA DE ESTILOS DINÁMICOS ---
  let timerClasses = "flex items-center gap-2 p-2 px-4 border-2 rounded-full font-bold transition-colors duration-500";
  
  if (seconds <= 60) { // Menos de 1 minuto
    timerClasses += " border-red-500 text-red-500 animate-pulse-slow"; // Palpitante lento
  } else if (seconds <= 180) { // Menos de 3 minutos
    timerClasses += " border-red-500 text-red-500"; // Rojo fijo
  } else {
    timerClasses += " border-blue-500 text-blue-500"; // Azul normal
  }

  return (
    <div className={timerClasses}>
      <Clock size={20} />
      <span>{formatTime(seconds)}</span>
    </div>
  );
};

export default Timer;