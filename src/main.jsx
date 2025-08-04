// src/main.jsx
import React, { Suspense } from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App.jsx';
import './index.css';
import { SimulationProvider } from './context/SimulationContext.jsx';
import './i18n'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Suspense es necesario porque las traducciones se cargan de forma asíncrona */}
    <Suspense fallback={<div>Cargando...</div>}>
      <SimulationProvider>
        <App />
      </SimulationProvider>
    </Suspense>
  </StrictMode>,
);