// src/pages/admin/categories/CategoriesPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosInstance';
import { categoriesData } from '../../../data/categoriesData'; // respaldo

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const inferCategory = (subcat) => {
    if (!subcat) return "Sin categoría";
    const map = {
      'literal': 'Lectura Crítica',
      'inferencial': 'Lectura Crítica',
      'analítica': 'Lectura Crítica',
      'algebra': 'Razonamiento Cuantitativo',
      'estadística': 'Razonamiento Cuantitativo',
      'geometría': 'Razonamiento Cuantitativo',
      'etica': 'Competencias Ciudadanas',
      'derechos humanos': 'Competencias Ciudadanas',
      'argumentación': 'Competencias Ciudadanas',
      'coherencia': 'Comunicación Escrita',
      'gramática': 'Inglés',
      'vocabulario': 'Inglés',
      'comprensión': 'Inglés'
    };
    const key = subcat.toLowerCase().trim();
    return map[key] || subcat;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/admin/getCategories');

        const fetchedCategories = res.data.map((cat, idx) => {
          const catName = cat.name || cat.category_name;
          if (!catName) {
            return categoriesData[idx] || {
              name: "Sin nombre",
              path: "sin-nombre",
              theme: { main: '#4A90E2', light: '#DDEBFF' }
            };
          }

          const existingCategory = categoriesData.find(c => c.name === catName);

          return existingCategory || {
            name: catName,
            path: catName.toLowerCase().replace(/\s+/g, '-'),
            theme: { main: '#4A90E2', light: '#DDEBFF' }
          };
        });

        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error cargando categorías', error);
        setCategories(categoriesData); 
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Categorías</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={cat.name || idx}
            className="p-6 rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform border-l-4"
            style={{ backgroundColor: cat.theme.light, borderColor: cat.theme.main }}
            onClick={() =>
              navigate(`/admin/categories/${cat.path}`, {
                state: { categoryName: cat.name }
              })
            }
          >
            <h3
              className="font-bold text-lg mb-2 break-words"
              style={{ color: cat.theme.main }}
            >
              {cat.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
