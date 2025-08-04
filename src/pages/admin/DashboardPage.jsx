// src/pages/admin/DashboardPage.jsx

import Card from '../../components/ui/Card';

const DashboardPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">TOTAL DE USUARIOS REGISTRADOS</h3>
        <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg">
          <p className="text-gray-400">Gráfico de Usuarios en construcción</p>
        </div>
      </Card>
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">TOTAL DE SIMULACROS REALIZADOS</h3>
        <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg">
          <p className="text-gray-400">Gráfico de Simulacros en construcción</p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;