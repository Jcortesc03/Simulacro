// src/hooks/useSimulation.js
import { useContext } from 'react';
import { SimulationContext } from '../context/SimulationContext'; // Importa el contexto

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation debe ser usado dentro de un SimulationProvider");
  }
  return context;
};