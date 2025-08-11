// src/context/SimulationProvider.jsx
import { useState } from 'react';
import { SimulationContext } from './SimulationContext';

export const SimulationProvider = ({ children }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const startSimulation = () => setIsSimulating(true);
  const endSimulation = () => setIsSimulating(false);
  const value = { isSimulating, startSimulation, endSimulation };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};