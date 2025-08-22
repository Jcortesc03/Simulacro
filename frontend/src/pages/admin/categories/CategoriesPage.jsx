// src/pages/admin/categories/CategoriesPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosInstance';
import { categoriesData } from '../../../data/categoriesData'; // respaldo

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      // ✅ Usa GET + params
      const res = await api.get('/questions/getQuestions', {
        params: {
          categoryName: "English",
          questionNumber: 1
        }
      });

        // Extraer categorías únicas del campo sub_category_name
        const categoryNames = [...new Set(res.data.map(q => inferCategory(q.sub_category_name)))];
        
        const mapped = categoryNames.map(name => {
          const found = categoriesData.find(c => c.name === name);
          return found || {
            name,
            path: name.toLowerCase().replace(/\s+/g, '-'),
            theme: { main: '#4A90E2', light: '#DDEBFF' }
          };
        });

        setCategories(mapped);
      } catch (error) {
        console.error('Error cargando categorías', error);
        // Usa datos de respaldo
        setCategories(categoriesData);
      }
    };

    fetchCategories();
  }, []);

  // Mapeo de subcategoría a categoría
  const inferCategory = (subcat) => {
    const map = {
      'literal': 'Lectura Crítica',
      'inferencial': 'Lectura Crítica',
      'analítica': 'Lectura Crítica',
      'algebra': 'Razonamiento Cuantitativo',
      'estadística': 'Razonamiento Cuantitativo',
      'geometría': 'Razonamiento Cuantitativo',
      'etica': 'Competencias Ciudadanas',
      'derechos Humanos': 'Competencias Ciudadanas',
      'argumentación': 'Competencias Ciudadanas',
      'coherencia': 'Comunicación Escrita',
      'gramática': 'Inglés',
      'vocabulario': 'Inglés',
      'comprensión': 'Inglés'
    };
    const key = subcat.toLowerCase().trim();
    return map[key] || subcat;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div
            key={cat.name}
            className="p-6 rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform border-l-4"
            style={{ backgroundColor: cat.theme.light, borderColor: cat.theme.main }}
            onClick={() => navigate(`/admin/categories/${cat.path}`)}
          >
            <h3 className="font-bold text-lg mb-2 break-words" style={{ color: cat.theme.main }}>
              {cat.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;