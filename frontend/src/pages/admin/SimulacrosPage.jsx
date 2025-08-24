// src/pages/admin/SimulacrosPage.jsx
import { useState, useMemo, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Users, BookOpen, Calendar, TrendingUp } from "lucide-react";
import Card from "../../components/ui/Card";
import api from "../../api/axiosInstance";

// Función para obtener el nivel y color basado en el puntaje
const getNivelInfo = (puntaje) => {
  const score = parseFloat(puntaje) || 0;

  if (score >= 0 && score <= 144) {
    return { nivel: "Nivel 1", color: "text-red-600", bgColor: "bg-red-100 text-red-800" };
  } else if (score >= 145 && score <= 164) {
    return { nivel: "Nivel 2", color: "text-orange-600", bgColor: "bg-orange-100 text-orange-800" };
  } else if (score >= 165 && score <= 220) {
    return { nivel: "Nivel 3", color: "text-yellow-600", bgColor: "bg-yellow-100 text-yellow-800" };
  } else if (score >= 221 && score <= 300) {
    return { nivel: "Nivel 4", color: "text-green-600", bgColor: "bg-green-100 text-green-800" };
  } else {
    return { nivel: "Sin clasificar", color: "text-gray-600", bgColor: "bg-gray-100 text-gray-800" };
  }
};

// Componente de estadísticas
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

// Componente de paginación
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Solo mostrar máximo 5 páginas
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push('...');
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        if (totalPages > 5) {
          pages.push('...');
        }
        for (let i = Math.max(totalPages - 4, 1); i <= totalPages; i++) {
          if (i > 1) pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= Math.min(currentPage + 1, totalPages); i++) {
          if (i > 1 && i < totalPages) pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    // Asegurar que no se muestren más de 5 números de página (sin contar '...')
    const numberPages = pages.filter(page => typeof page === 'number');
    if (numberPages.length > 5) {
      return numberPages.slice(0, 5);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronLeft size={16} className="mr-1" />
        Anterior
      </button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Siguiente
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};

const SimulacrosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [simulacrosData, setSimulacrosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchSimulacros = async () => {
      try {
        const res = await api.get("/tests/allSimulations");
        setSimulacrosData(res.data.data || []);
      } catch (err) {
        console.error("Error cargando simulacros:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulacros();
  }, []);

  // Obtener lista única de materias
  const materias = useMemo(() => {
    const uniqueMaterias = [...new Set(simulacrosData.map(item => item.simulacro))];
    return uniqueMaterias.sort();
  }, [simulacrosData]);

  // Filtrar simulacros
  const filteredSimulacros = useMemo(() => {
    let filtered = simulacrosData;

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.estudiante?.toLowerCase().includes(lowercasedFilter) ||
          item.carrera?.toLowerCase().includes(lowercasedFilter) ||
          item.simulacro?.toLowerCase().includes(lowercasedFilter)
      );
    }

    if (selectedMateria) {
      filtered = filtered.filter(item => item.simulacro === selectedMateria);
    }

    return filtered;
  }, [searchTerm, selectedMateria, simulacrosData]);

  // Paginación
  const paginatedSimulacros = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSimulacros.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSimulacros, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSimulacros.length / itemsPerPage);

  // Estadísticas actualizadas con niveles
  const stats = useMemo(() => {
    if (!simulacrosData.length) return {
      total: 0,
      promedio: 0,
      mejorNota: 0,
      distribucionNiveles: {}
    };

    const total = simulacrosData.length;
    const notas = simulacrosData.map(item => parseFloat(item.nota) || 0);
    const promedio = notas.reduce((sum, nota) => sum + nota, 0) / total;
    const mejorNota = Math.max(...notas);

    // Calcular distribución por niveles
    const distribucionNiveles = {
      "Nivel 1": 0,
      "Nivel 2": 0,
      "Nivel 3": 0,
      "Nivel 4": 0
    };

    notas.forEach(nota => {
      const { nivel } = getNivelInfo(nota);
      if (distribucionNiveles.hasOwnProperty(nivel)) {
        distribucionNiveles[nivel]++;
      }
    });

    return {
      total,
      promedio: promedio.toFixed(1),
      mejorNota: mejorNota.toFixed(1),
      distribucionNiveles
    };
  }, [simulacrosData]);

  // Reset página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMateria]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedMateria("");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando historial de simulacros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header con estadísticas */}
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historial de Simulacros
          </h1>
          <p className="text-gray-600">
            Gestione y supervise el rendimiento académico de los estudiantes
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            title="Total Simulacros"
            value={stats.total}
            icon={BookOpen}
            color="bg-blue-600"
          />
          <StatsCard
            title="Promedio General"
            value={stats.promedio}
            icon={TrendingUp}
            color="bg-green-600"
          />
          <StatsCard
            title="Mejor Calificación"
            value={stats.mejorNota}
            icon={Users}
            color="bg-purple-600"
          />
        </div>

        {/* Distribución por niveles */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Niveles</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.distribucionNiveles).map(([nivel, cantidad]) => (
              <div key={nivel} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{cantidad}</div>
                <div className="text-sm text-gray-600">{nivel}</div>
                <div className="text-xs text-gray-500">
                  {nivel === "Nivel 1" && "(0-144)"}
                  {nivel === "Nivel 2" && "(145-164)"}
                  {nivel === "Nivel 3" && "(165-220)"}
                  {nivel === "Nivel 4" && "(221-300)"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card>
        {/* Controles de filtrado */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por estudiante, carrera o simulacro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por materia */}
            <div className="relative min-w-[250px]">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={selectedMateria}
                onChange={(e) => setSelectedMateria(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Todas las materias</option>
                {materias.map((materia) => (
                  <option key={materia} value={materia}>
                    {materia}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                <ChevronRight size={16} className="rotate-90" />
              </div>
            </div>

            {/* Botón reset */}
            {(searchTerm || selectedMateria) && (
              <button
                onClick={resetFilters}
                className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Información de resultados */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>
              Mostrando {paginatedSimulacros.length} de {filteredSimulacros.length} simulacros
              {filteredSimulacros.length !== simulacrosData.length &&
                ` (${simulacrosData.length} total)`}
            </p>
            {totalPages > 1 && (
              <p>
                Página {currentPage} de {totalPages}
              </p>
            )}
          </div>
        </div>

        {/* Tabla desktop */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Estudiante
                </th>
                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Carrera
                </th>
                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Simulacro
                </th>
                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Puntaje
                </th>
                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Nivel
                </th>
                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedSimulacros.map((item, index) => {
                const nivelInfo = getNivelInfo(item.nota);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.estudiante}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">{item.carrera}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.simulacro}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className={`font-bold text-lg ${nivelInfo.color}`}>
                          {item.nota}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">/300</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${nivelInfo.bgColor}`}>
                        {nivelInfo.nivel}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={14} className="mr-2" />
                        {item.fecha}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Versión mobile */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {paginatedSimulacros.map((item) => {
            const nivelInfo = getNivelInfo(item.nota);
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.estudiante}
                    </h3>
                    <p className="text-sm text-gray-600">{item.carrera}</p>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-xl ${nivelInfo.color}`}>
                      {item.nota}
                    </div>
                    <div className="text-xs text-gray-400">/ 300</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.simulacro}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${nivelInfo.bgColor}`}>
                    {nivelInfo.nivel}
                  </span>
                </div>

                <div className="flex items-center justify-center pt-3 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    {item.fecha}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {filteredSimulacros.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron simulacros
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedMateria
                ? "Intenta con diferentes criterios de búsqueda"
                : "Aún no hay simulacros registrados en el sistema"}
            </p>
            {(searchTerm || selectedMateria) && (
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  );
};

export default SimulacrosPage;
