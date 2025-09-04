// src/pages/student/CalificacionesPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Calendar, Filter, Search, X, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axiosInstance from '../../api/axiosInstance';

// Componente para la insignia del Nivel
const NivelBadge = ({ level }) => {
  const levelColors = {
    'Nivel 1': 'bg-red-100 text-red-700 border border-red-200',
    'Nivel 2': 'bg-amber-100 text-amber-700 border border-amber-200',
    'Nivel 3': 'bg-blue-100 text-blue-700 border border-blue-200',
    'Nivel 4': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
        levelColors[level] || 'bg-gray-100 text-gray-700 border border-gray-200'
      }`}
    >
      {level}
    </span>
  );
};

// Helper para formatear fechas
const formatDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return 'N/A';

  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!match) {
    console.error("Formato de fecha inesperado:", dateString);
    return 'Fecha inválida';
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // Mes es 0-indexado
  const day = parseInt(match[3], 10);
  
  const date = new Date(Date.UTC(year, month, day));

  if (isNaN(date.getTime())) return 'Fecha inválida';

  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC'
  });
};

// Helper para asegurar que el score siempre sea número
const formatScore = (score) => {
  const num = Number(score);
  return isNaN(num) ? '0' : num.toFixed(0);
};

// Componente de filtros
const FiltersSection = ({ filters, onFiltersChange, examNames, levels }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      selectedExam: '',
      selectedLevel: '',
      dateRange: 'all'
    });
  };

  const hasActiveFilters = filters.searchTerm || filters.selectedExam || filters.selectedLevel || filters.dateRange !== 'all';

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Filtros de Búsqueda</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
              Filtros Aplicados
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar examen..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Filtro por examen */}
        <select
          value={filters.selectedExam}
          onChange={(e) => handleFilterChange('selectedExam', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all"
        >
          <option value="">Todos los exámenes</option>
          {examNames.map((exam) => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>

        {/* Filtro por nivel */}
        <select
          value={filters.selectedLevel}
          onChange={(e) => handleFilterChange('selectedLevel', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all"
        >
          <option value="">Todos los niveles</option>
          {levels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        {/* Filtro por fecha */}
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all"
        >
          <option value="all">Todas las fechas</option>
          <option value="last7">Últimos 7 días</option>
          <option value="last30">Últimos 30 días</option>
          <option value="last90">Últimos 3 meses</option>
        </select>
      </div>
    </Card>
  );
};

// Componente de gráficos
const ChartsSection = ({ filteredAttempts }) => {
  // Datos para el gráfico de línea (progreso temporal)
  const lineChartData = filteredAttempts
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item, index) => ({
      intento: index + 1,
      puntaje: item.score,
      fecha: formatDate(item.date),
      examen: item.examName
    }));

  // Datos para el gráfico de barras (por examen)
  const examScores = filteredAttempts.reduce((acc, item) => {
    if (!acc[item.examName]) {
      acc[item.examName] = [];
    }
    acc[item.examName].push(item.score);
    return acc;
  }, {});

  const barChartData = Object.entries(examScores).map(([exam, scores]) => ({
    examen: exam.length > 15 ? exam.substring(0, 15) + '...' : exam,
    promedio: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
    intentos: scores.length
  }));

  // Datos para el gráfico de pie (distribución de niveles)
  const levelDistribution = filteredAttempts.reduce((acc, item) => {
    acc[item.level] = (acc[item.level] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(levelDistribution).map(([level, count]) => ({
    name: level,
    value: count,
    percentage: Math.round((count / filteredAttempts.length) * 100)
  }));

  const pieColors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

  if (filteredAttempts.length === 0) {
    return (
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Análisis Gráfico</h3>
        <div className="h-64 bg-gray-50 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">No hay datos para mostrar gráficos</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        Análisis Gráfico de Rendimiento
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de progreso temporal */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Progreso Temporal</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="intento"
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} puntos`,
                    props.payload.examen
                  ]}
                  labelFormatter={(label) => `Intento ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="puntaje"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de distribución de niveles */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Distribución por Nivel</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} pruebas`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de promedios por examen */}
        {barChartData.length > 1 && (
          <div className="lg:col-span-2">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Promedio por Examen</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="examen"
                    stroke="#666"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#666"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} puntos promedio`,
                      `${props.payload.intentos} intentos`
                    ]}
                  />
                  <Bar
                    dataKey="promedio"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const CalificacionesPage = () => {
  const navigate = useNavigate();
  const [detailsLoading, setDetailsLoading] = useState(null);
  const [calificacionesData, setCalificacionesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailedCharts, setShowDetailedCharts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedExam: '',
    selectedLevel: '',
    dateRange: 'all'
  });

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await axiosInstance.get('/tests/student-history');

        // Normalizamos los datos
        const normalized = {
          ...response.data,
          attempts: response.data.attempts.map((a) => {
            
            // --- ¡AÑADE ESTA LÍNEA DE DIAGNÓSTICO AQUÍ! ---
            console.log('Fecha recibida del backend:', a.start_time);

            return {
              ...a,
              score: Number(a.score) || 0,
              date: a.start_time
            };
          })
        };

        setCalificacionesData(normalized);
      } catch (err) {
        setError(
          'No se pudo cargar el historial de pruebas. Por favor, inténtalo de nuevo más tarde.'
        );
        console.error(err);
      }
      setLoading(false);
    };

    fetchAttempts();
  }, []);

  // Filtrar y calcular estadísticas
  const { filteredAttempts, calculatedAverage, examNames, levels } = useMemo(() => {
    if (!calificacionesData?.attempts) {
      return { filteredAttempts: [], calculatedAverage: 0, examNames: [], levels: [] };
    }

    let filtered = [...calificacionesData.attempts];

    // Aplicar filtros
    if (filters.searchTerm) {
      filtered = filtered.filter(item =>
        item.examName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.selectedExam) {
      filtered = filtered.filter(item => item.examName === filters.selectedExam);
    }

    if (filters.selectedLevel) {
      filtered = filtered.filter(item => item.level === filters.selectedLevel);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const daysAgo = {
        last7: 7,
        last30: 30,
        last90: 90
      }[filters.dateRange];

      if (daysAgo) {
        const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= cutoffDate;
        });
      }
    }

    // Calcular promedio de los datos filtrados
    const average = filtered.length > 0
      ? filtered.reduce((sum, item) => sum + item.score, 0) / filtered.length
      : 0;

    // Obtener listas únicas para filtros
    const uniqueExams = [...new Set(calificacionesData.attempts.map(item => item.examName))];
    const uniqueLevels = [...new Set(calificacionesData.attempts.map(item => item.level))];

    return {
      filteredAttempts: filtered,
      calculatedAverage: average,
      examNames: uniqueExams,
      levels: uniqueLevels
    };
  }, [calificacionesData, filters]);

  // Paginación
  const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttempts = filteredAttempts.slice(startIndex, endIndex);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const navigateToDetails = async (attempt) => {
    setDetailsLoading(attempt.id);
    try {
      const response = await axiosInstance.get(`/tests/attempt-details/${attempt.id}`);
      const detailedResults = response.data;

      navigate(`/student/simulacion/${attempt.id}/resultados`, {
        state: {
          results: detailedResults,
          from: '/student/calificaciones' // Para que el botón "Volver" regrese aquí
        },
      });
    } catch (err) {
      console.error("Error al cargar detalles:", err);
      alert("No se pudieron cargar los detalles de esta prueba.");
    } finally {
      setDetailsLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial de calificaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!calificacionesData || calificacionesData.attempts.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay pruebas realizadas</h3>
          <p className="text-gray-600 mb-4">Aún no has completado ninguna prueba.</p>
          <Button
            onClick={() => navigate('/student/pruebas')}
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Realizar Primera Prueba
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- SECCIÓN SUPERIOR (ORIGINAL) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="flex flex-col items-center justify-center text-center h-full bg-slate-50 border-slate-200">
            <p className="text-6xl font-bold text-slate-800">
              {Math.round(calculatedAverage)}
            </p>
            <h3 className="text-slate-600 font-semibold mt-2 tracking-wide uppercase text-sm">
              Puntaje Global Promedio
              {filteredAttempts.length !== calificacionesData.attempts.length && (
                <span className="block text-xs text-blue-600 normal-case mt-1">
                  ({filteredAttempts.length} de {calificacionesData.attempts.length} pruebas)
                </span>
              )}
            </h3>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Progreso General</h2>
              <button
                onClick={() => setShowDetailedCharts(!showDetailedCharts)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                {showDetailedCharts ? 'Ocultar Gráficos' : 'Ver Más Gráficos'}
              </button>
            </div>
            <div className="h-48">
              {filteredAttempts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredAttempts
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((item, index) => ({
                      intento: index + 1,
                      puntaje: item.score,
                      fecha: formatDate(item.date),
                      examen: item.examName.length > 20 ? item.examName.substring(0, 20) + '...' : item.examName
                    }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="intento"
                      stroke="#666"
                      fontSize={12}
                      label={{ value: 'Número de Intento', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis
                      stroke="#666"
                      fontSize={12}
                      domain={[0, 100]}
                      label={{ value: 'Puntaje', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} puntos`,
                        props.payload.examen
                      ]}
                      labelFormatter={(label) => `Intento #${label}`}
                      contentStyle={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="puntaje"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#FFFFFF' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full bg-gray-50 flex items-center justify-center rounded-lg">
                  <p className="text-gray-400">No hay datos para mostrar</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Filtros */}
      <FiltersSection
        filters={filters}
        onFiltersChange={setFilters}
        examNames={examNames}
        levels={levels}
      />

      {/* Gráficos detallados (condicionales) */}
      {showDetailedCharts && <ChartsSection filteredAttempts={filteredAttempts} />}

      {/* --- TABLA DE HISTORIAL --- */}
      <Card className="overflow-hidden p-0">
        {filteredAttempts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-500">Intenta ajustar los filtros para ver más resultados.</p>
          </div>
        ) : (
          <>
            {/* Información de paginación */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredAttempts.length)} de {filteredAttempts.length} resultados
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>

            {/* Vista de escritorio */}
            <div className="hidden md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="p-4 font-semibold uppercase text-sm">Examen</th>
                    <th className="p-4 font-semibold uppercase text-sm">Puntaje</th>
                    <th className="p-4 font-semibold uppercase text-sm">Nivel</th>
                    <th className="p-4 font-semibold uppercase text-sm">Fecha</th>
                    <th className="p-4 font-semibold uppercase text-sm text-center">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedAttempts.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-slate-50">
                      <td className="p-4 font-medium text-gray-800">{item.examName}</td>
                      <td className="p-4 font-bold text-gray-700">
                        {formatScore(item.score)}
                      </td>
                      <td className="p-4">
                        <NivelBadge level={item.level} />
                      </td>
                      <td className="p-4 text-gray-600">{formatDate(item.date)}</td>
                      <td className="p-4 text-center">
                        <Button
                          onClick={() => navigateToDetails(item)}
                          variant="primary"
                          className="bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-lg"
                          disabled={detailsLoading === item.id}
                        >
                          {detailsLoading === item.id ? 'Cargando...' : 'Detalles'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista móvil */}
            <div className="md:hidden">
              <div className="divide-y divide-gray-200">
                {paginatedAttempts.map((item, index) => (
                  <div key={item.id || index} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-lg text-gray-800">{item.examName}</p>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-slate-700">
                          {formatScore(item.score)}
                        </p>
                        <NivelBadge level={item.level} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar size={14} /> {formatDate(item.date)}
                    </p>
                    <div className="pt-2">
                      <Button
                        onClick={() => navigateToDetails(item)}
                        variant="primary"
                        className="w-full bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 rounded-lg"
                        disabled={detailsLoading === item.id}
                      >
                        {detailsLoading === item.id ? 'Cargando...' : 'Ver Detalles'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CalificacionesPage;
