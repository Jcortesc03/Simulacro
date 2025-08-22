// src/context/SimulationContext.jsx

import React, { createContext, useState, useContext } from 'react';

const SimulationContext = createContext();

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  // --- ¡CAMBIO CLAVE! ---
  // Si el contexto no existe, lanzamos un error claro o devolvemos valores por defecto.
  if (context === undefined) {
    console.error("useSimulation must be used within a SimulationProvider");
    // Devolvemos valores por defecto para evitar que la app se rompa
    return { isSimulating: false, startSimulation: () => {}, endSimulation: () => {} };
  }
  return context;
};

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