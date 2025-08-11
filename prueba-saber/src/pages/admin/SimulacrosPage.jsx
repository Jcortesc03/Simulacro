// 1. IMPORTA los hooks necesarios de React
import { useState, useMemo } from 'react'; 
import AdminLayout from '../../components/layout/AdminLayout';
import { Search } from 'lucide-react';

// Datos de ejemplo
const simulacrosData = [
  { id: 1, estudiante: 'Juan Londoño', carrera: 'Derecho', simulacro: 'Algebra', nota: 300, fecha: '30/02/25' },
  { id: 2, estudiante: 'Juan Londoño', carrera: 'Psicologia', simulacro: 'Lectura', nota: 187, fecha: '30/02/25' },
  { id: 3, estudiante: 'Ana Castillo', carrera: 'Ing. Sistemas', simulacro: 'Escritura', nota: 100, fecha: '30/02/25' },
  { id: 4, estudiante: 'Pedro Gomez', carrera: 'Veterinaria', simulacro: 'Competencias', nota: 200, fecha: '30/02/25' },
  { id: 5, estudiante: 'Juan Londoño', carrera: 'Cocina', simulacro: 'Lectura', nota: 267, fecha: '30/02/25' },
  { id: 6, estudiante: 'Ana Castillo', carrera: 'Derecho', simulacro: 'Algebra', nota: 89, fecha: '28/02/25' },
];

const SimulacrosPage = () => {
  // 2. DECLARA el estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // 3. AÑADE la lógica de filtrado
  const filteredSimulacros = useMemo(() => {
    if (!searchTerm) {
      return simulacrosData; // Si no hay búsqueda, devuelve todos los datos
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return simulacrosData.filter(item =>
      item.estudiante.toLowerCase().includes(lowercasedFilter) ||
      item.carrera.toLowerCase().includes(lowercasedFilter) ||
      item.simulacro.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]); // Se recalcula solo cuando 'searchTerm' cambia

  return (
    <AdminLayout title="SIMULACROS">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* --- BARRA DE BÚSQUEDA --- */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por estudiante, carrera, simulacro..."
              // 4. CONECTA el input al estado
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <button className="bg-brand-blue text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Search size={20} />
            <span>Buscar</span>
          </button>
        </div>

        {/* --- TABLA PARA DESKTOP --- */}
        <table className="w-full text-left hidden md:table">
          <thead className="bg-light-gray">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Estudiante</th>
              <th className="p-4 font-semibold text-gray-600">Carrera</th>
              <th className="p-4 font-semibold text-gray-600">Simulacro</th>
              <th className="p-4 font-semibold text-gray-600">Nota</th>
              <th className="p-4 font-semibold text-gray-600">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {/* 5. USA los datos filtrados */}
            {filteredSimulacros.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-800">{item.estudiante}</td>
                <td className="p-4 text-gray-600">{item.carrera}</td>
                <td className="p-4 text-gray-600">{item.simulacro}</td>
                {/* CORRECCIÓN: .toFixed(1) dará error en números enteros. Mejor no usarlo o asegurarse de que la nota sea flotante. Lo quito para evitar errores. */}
                <td className="p-4 text-gray-600">{item.nota}</td>
                <td className="p-4 text-gray-600">{item.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- LISTA DE TARJETAS PARA MÓVIL --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {/* 5. USA los datos filtrados también aquí */}
          {filteredSimulacros.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg text-gray-800">{item.estudiante}</p>
                <p className="font-bold text-lg text-brand-blue">{item.nota}</p>
              </div>
              <p className="text-sm text-gray-600"><span className="font-semibold">Simulacro:</span> {item.simulacro}</p>
              <p className="text-sm text-gray-600"><span className="font-semibold">Carrera:</span> {item.carrera}</p>
              <p className="text-xs text-gray-500 text-right">{item.fecha}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SimulacrosPage;