// src/pages/admin/categories/CategoriesPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileText, TrendingUp, Grid3X3, ChevronRight, PlusCircle } from 'lucide-react';
import api from '../../../api/axiosInstance';
import { categoriesData } from '../../../data/categoriesData'; // respaldo

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddQuestion = () => {
    navigate('/admin/questions');
  };

  // Mapeo de iconos por categoría
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Lectura Crítica': BookOpen,
      'Razonamiento Cuantitativo': TrendingUp,
      'Competencias Ciudadanas': Users,
      'Comunicación Escrita': FileText,
      'Inglés': Grid3X3,
    };

    const IconComponent = iconMap[categoryName] || BookOpen;
    return IconComponent;
  };

  // Función para generar path consistente
  const generateCategoryPath = (categoryName) => {
    if (!categoryName) return 'sin-nombre';
    return categoryName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, ''); // Remover caracteres especiales
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching admin categories...');

        // Intentar primero con el endpoint de admin
        let res;
        try {
          res = await api.get('/admin/getCategories');
        } catch (adminError) {
          console.warn('Admin endpoint failed, trying teacher endpoint:', adminError);
          res = await api.get('/categories/');
        }

        console.log('Categories response:', res.data);

        const fetchedCategories = res.data.map((cat, idx) => {
          const catName = cat.name || cat.category_name || cat.categoryName;

          if (!catName) {
            console.warn('Category without name at index:', idx, cat);
            return categoriesData[idx] || {
              name: "Sin nombre",
              path: "sin-nombre",
              theme: { main: '#4A90E2', light: '#DDEBFF' }
            };
          }

          // Buscar en los datos de respaldo
          const existingCategory = categoriesData.find(c =>
            c.name.toLowerCase() === catName.toLowerCase()
          );

          const categoryData = existingCategory || {
            name: catName,
            path: generateCategoryPath(catName),
            theme: { main: '#4A90E2', light: '#DDEBFF' }
          };

          console.log('Processed category:', categoryData);
          return categoryData;
        });

        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error cargando categorías:', error);
        console.log('Using backup categories data');
        setCategories(categoriesData);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (cat) => {
    console.log('Navigating to category:', cat);
    const path = `/admin/categories/${cat.path}`;
    console.log('Navigation path:', path);

    navigate(path, {
      state: {
        categoryName: cat.name,
        categoryPath: cat.path,
        categoryData: cat
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <BookOpen size={28} className="text-blue-600" />
                  Categorías del Sistema
                </h2>
                <p className="text-gray-600">
                  Selecciona una categoría para gestionar su banco de preguntas y configuraciones específicas
                </p>
              </div>
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <PlusCircle size={20} />
                <span>Agregar Pregunta</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat, idx) => {
                  const IconComponent = getCategoryIcon(cat.name);

                  return (
                    <div
                      key={cat.name || idx}
                      className="group relative bg-white rounded-2xl shadow-sm border-2 border-gray-100 hover:border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      onClick={() => handleCategoryClick(cat)}
                    >
                      {/* Borde superior temático */}
                      <div
                        className="h-2 rounded-t-2xl"
                        style={{ backgroundColor: cat.theme.main }}
                      />

                      {/* Contenido de la tarjeta */}
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className="p-4 rounded-2xl shadow-sm"
                            style={{ backgroundColor: cat.theme.light }}
                          >
                            <IconComponent
                              size={32}
                              style={{ color: cat.theme.main }}
                            />
                          </div>
                          <ChevronRight
                            size={20}
                            className="text-gray-400 group-hover:text-gray-600 transition-colors"
                          />
                        </div>

                        <h3
                          className="text-xl font-bold mb-3 group-hover:underline break-words"
                          style={{ color: cat.theme.main }}
                        >
                          {cat.name}
                        </h3>

                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                          Gestiona las preguntas y evaluaciones relacionadas con esta área académica del sistema SABER.
                        </p>


                        {/* Indicadores de estado */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-gray-500">Activa</span>
                          </div>

                          <div
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${cat.theme.light}80`,
                              color: cat.theme.main
                            }}
                          >
                            Disponible
                          </div>
                        </div>
                      </div>

                      {/* Efecto hover */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                        style={{ backgroundColor: cat.theme.main }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="p-6 bg-gray-100 rounded-2xl inline-block mb-6">
                  <Grid3X3 size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No hay categorías disponibles
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  El sistema no ha podido cargar las categorías académicas.
                  Verifique la conexión y contacte al administrador del sistema.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
