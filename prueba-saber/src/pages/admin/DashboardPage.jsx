// src/pages/admin/DashboardPage.jsx
import AdminLayout from "../../components/layout/AdminLayout";

const DashboardPage = () => {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold rounded-lg   mb-6">ESTADISTICAS GENERALES</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">TOTAL DE USUARIOS REGISTRADOS</h3>
          <img src="/grafico-usuarios.png" alt="Gráfico Usuarios" className="w-full h-40 object-contain" />
        </div>
        <div className="bg-white border p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">TOTAL DE SIMULACROS</h3>
          <img src="/grafico-simulacros.png" alt="Gráfico Simulacros" className="w-full h-40 object-contain" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
