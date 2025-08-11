// src/components/dashboard/StartSimulationCard.jsx

import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StartSimulationCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-blue-600 text-white text-center flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-2">¿Listo para un nuevo reto?</h2>
      <p className="mb-6">Haz clic aquí para comenzar un nuevo simulacro general.</p>
      <Button 
        onClick={() => navigate('/student/pruebas')} // O a la ruta específica del simulacro general
        className="bg-white text-blue-600 hover:bg-gray-200 font-bold"
      >
        <div className='flex items-center gap-2'>
          <PlayCircle />
          <span>Iniciar Simulacro</span>
        </div>
      </Button>
    </Card>
  );
};

export default StartSimulationCard;