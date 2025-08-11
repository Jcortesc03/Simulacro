import AdminLayout from '../../components/layout/AdminLayout'; // Reutilizamos el layout

const MaestroDashboardPage = () => {
  return (
    <AdminLayout title="Dashboard del Maestro">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Bienvenido, Maestro. Aquí verás tus estadísticas y accesos directos.</p>
        {/* Aquí irían las gráficas y resúmenes para el maestro */}
      </div>
    </AdminLayout>
  );
};

export default MaestroDashboardPage;