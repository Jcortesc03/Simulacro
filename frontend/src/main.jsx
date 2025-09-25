import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style/index.css';

import { AuthProvider } from './context/AuthProvider.jsx';
import { SimulationProvider } from './context/SimulationContext.jsx';

import { BrowserRouter } from 'react-router-dom'; // <-- Importa BrowserRouter aquí

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SimulationProvider>
          <App />
        </SimulationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
