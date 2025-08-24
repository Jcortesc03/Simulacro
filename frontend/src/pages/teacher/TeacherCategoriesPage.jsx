import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileText, TrendingUp, Grid3X3, ChevronRight, PlusCircle } from 'lucide-react';
import api from '../../api/axiosInstance';
import { categoriesData } from '../../data/categoriesData'; // respaldo

const TeacherCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddQuestion = () => {
    navigate('/teacher/questions');
  };

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

  // Función para inferir categoría (mantenida del código original)
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
        setLoading(true);
        const res = await api.get('/categories/');
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
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <BookOpen size={28} className="text-green-600" />
                  Categorías Académicas
                </h2>
                <p className="text-gray-600">
                  Explora las diferentes áreas académicas para revisar contenido y realizar seguimiento a tus estudiantes
                </p>
              </div>
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
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
                      onClick={() =>
                        navigate(`/teacher/categories/${cat.path}`, {
                          state: { categoryName: cat.name }
                        })
                      }
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
                          Revisa el contenido académico y realiza seguimiento al progreso de tus estudiantes en esta área.
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

export default TeacherCategoriesPage;
