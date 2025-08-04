// src/data/categoriesData.js

export const categoriesData = [
  { 
    name: 'Lectura Crítica', 
    path: 'lectura-critica', 
    theme: {
      main: '#4A90E2', // Un azul más fuerte para texto y botones
      light: '#DDEBFF'  // El color pastel para fondos
    } 
  },
  { 
    name: 'Razonamiento Cuantitativo', 
    path: 'razonamiento-cuantitativo', 
    theme: {
      main: '#D0021B', // Rojo
      light: '#FFDCDC'
    } 
  },
  { 
    name: 'Competencias Ciudadanas', 
    path: 'competencias-ciudadanas', 
    theme: {
      main: '#9013FE', // Morado
      light: '#EADCFD'
    } 
  },
  { 
    name: 'Comunicación Escrita', 
    path: 'comunicacion-escrita', 
    theme: {
      main: '#F5A623', // Naranja
      light: '#FFEFD3'
    } 
  },
  { 
    name: 'Inglés', 
    path: 'ingles', 
    theme: {
      main: '#2E8B57', // Verde
      light: '#DDFBE4'
    } 
  }
];

// Un helper para buscar una categoría por su 'path' fácilmente
export const findCategoryByPath = (path) => {
  return categoriesData.find(cat => cat.path === path);
};