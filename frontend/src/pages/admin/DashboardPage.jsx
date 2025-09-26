// src/pages/admin/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Users, ClipboardList, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../api/axiosInstance';
import Card from '../../components/ui/Card'; // Asegúrate de que la ruta sea correcta
import StatsCard from '../../components/ui/StatsCard'; // Asegúrate de que la ruta sea correcta

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="h-28 bg-gray-200 rounded-lg"></div>
          <div className="h-28 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Tarjetas de Estadísticas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatsCard
          title="Total de Usuarios Registrados"
          value={stats ? stats.totalUsers : '0'}
          icon={Users}
          colorClass="bg-blue-600"
        />
        <StatsCard
          title="Total de Simulacros Realizados"
          value={stats ? stats.totalSimulations : '0'}
          icon={ClipboardList}
          colorClass="bg-green-600"
        />
      </div>

      {/* Gráfico de Barras */}
      {stats && stats.averageScores && stats.averageScores.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <BarChart3 className="text-purple-600" />
            Promedio de Puntajes por Asignatura
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <BarChart
                data={stats.averageScores}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 12 }} 
                  angle={-10}
                  textAnchor="end"
                  height={50}
                />
                <YAxis domain={[0, 300]} tick={{ fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(238, 242, 255, 0.6)' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="averageScore" 
                  name="Puntaje Promedio" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;