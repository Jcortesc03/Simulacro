// src/pages/admin/categories/CategoriesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';



// Sin cambios aquí
const categories = [
  { name: 'Lectura Crítica', path: 'lectura-critica', color: '#DDEBFF' },
  { name: 'Razonamiento Cuantitativo', path: 'razonamiento-cuantitativo', color: '#FFDCDC' },
  { name: 'Competencias Ciudadanas', path: 'competencias-ciudadanas', color: '#EADCFD' },
  { name: 'Comunicación Escrita', path: 'comunicacion-escrita', color: '#FFEFD3' },
  { name: 'Inglés', path: 'ingles', color: '#DDFBE4' }
];

export default function CategoriesPage() {
  const navigate = useNavigate();

  // Mantenemos tu estructura original
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold rounded-lg   mb-6">CATEGORÍAS</h2>

      {/* 
        --- ÚNICO CAMBIO REALIZADO ---
        Se modifica esta línea para que el grid sea responsive.
        - grid-cols-1: 1 columna en móvil (por defecto).
        - sm:grid-cols-2: 2 columnas en tablets y pantallas pequeñas.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* El resto del código de las tarjetas se mantiene exactamente como lo tenías */}
        {categories.map(cat => (
          <div
            key={cat.name}
            className="p-6 rounded-lg shadow-md cursor-pointer hover:scale-105 transition"
            style={{ backgroundColor: cat.color }}
            onClick={() => navigate(`/admin/categories/${cat.path}`)}
          >
            {/* 
              Para el texto desbordado, la solución más simple sin cambiar el layout
              es permitir que las palabras se partan con 'break-words'.
            */}
            <h3 className="font-bold text-lg mb-2 break-words">{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}