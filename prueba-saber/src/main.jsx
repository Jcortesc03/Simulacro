import React, { Suspense } from 'react'; // Importa Suspense
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Importa la configuración de i18n
import './i18n'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Suspense es necesario porque las traducciones se cargan de forma asíncrona */}
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);