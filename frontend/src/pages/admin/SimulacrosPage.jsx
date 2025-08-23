// src/pages/admin/SimulacrosPage.jsx
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import Card from "../../components/ui/Card";
import api from "../../api/axiosInstance";

const SimulacrosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [simulacrosData, setSimulacrosData] = useState([]);
  const [loading, setLoading] = useState(true);


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


  const filteredSimulacros = useMemo(() => {
    if (!searchTerm) return simulacrosData;
    const lowercasedFilter = searchTerm.toLowerCase();
    return simulacrosData.filter(
      (item) =>
        item.estudiante?.toLowerCase().includes(lowercasedFilter) ||
        item.carrera?.toLowerCase().includes(lowercasedFilter) ||
        item.simulacro?.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, simulacrosData]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando simulacros...</p>;
  }

  return (
    <Card>
      {/* 🔹 Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto flex-grow">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por estudiante, carrera, simulacro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 🔹 Tabla desktop */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4 font-semibold uppercase text-sm">
                Estudiante
              </th>
              <th className="p-4 font-semibold uppercase text-sm">Carrera</th>
              <th className="p-4 font-semibold uppercase text-sm">Simulacro</th>
              <th className="p-4 font-semibold uppercase text-sm">Nota</th>
              <th className="p-4 font-semibold uppercase text-sm">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSimulacros.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-4 text-gray-800 font-medium">
                  {item.estudiante}
                </td>
                <td className="p-4 text-gray-600">{item.carrera}</td>
                <td className="p-4 text-gray-600">{item.simulacro}</td>
                <td className="p-4 font-bold text-gray-700">{item.nota}</td>
                <td className="p-4 text-gray-600">{item.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Versión mobile */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredSimulacros.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-2"
          >
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg text-gray-800">
                {item.estudiante}
              </p>
              <p className="font-bold text-lg text-blue-600">{item.nota}</p>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Simulacro:</span> {item.simulacro}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Carrera:</span> {item.carrera}
            </p>
            <p className="text-xs text-gray-500 text-right">{item.fecha}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SimulacrosPage;
