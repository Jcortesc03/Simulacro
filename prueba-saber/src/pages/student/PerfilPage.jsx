// src/pages/student/PerfilPage.jsx

import StudentLayout from '../../components/layout/StudentLayout'; // ¡IMPORTANTE! Usa el layout de estudiante

const StudentPerfilPage = () => {
  return (
    // Usa el StudentLayout, que ya está definido en App.jsx como ruta padre,
    // por lo que no necesitamos envolverlo aquí directamente. 
    // Si tus otras páginas de estudiante tampoco lo usan, esta es la forma correcta.
    
    // Si quieres que el StudentLayout se llame desde aquí (como en admin),
    // esta sería la estructura:
    // <StudentLayout title="Mi Perfil">
    //   ... contenido ...
    // </StudentLayout>
    // Por ahora, seguiremos la estructura definida en App.jsx

    <div className="flex flex-col items-center p-10 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-2">PERFIL</h2>
      <div className="text-center mb-8">
        <svg className="mx-auto  mb-2" width="80" height="80" fill="none" stroke="black" strokeWidth="2">
          <circle cx="40" cy="30" r="20" />
          <path d="M10 80 Q40 60 70 80" />
        </svg>
        {/* Datos de ejemplo del estudiante */}
        <h3 className="text-lg font-bold text-gray-700">Daniela Arango</h3>
        <p className="text-sm text-gray-500">Estudiante</p>
      </div>

      <form className="w-full max-w-md text-left">
        <h4 className="text-md font-semibold text-blue-800 mb-3">Cambiar Contraseña</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="password"
            placeholder="Anterior Contraseña"
            className="p-2 border rounded bg-gray-50"
          />
          <input
            type="password"
            placeholder="Nueva Contraseña"
            className="p-2 border rounded bg-gray-50"
          />
        </div>
        <input
          type="password"
          placeholder="Confirmar Nueva Contraseña"
          className="w-full p-2 border rounded bg-gray-50 mb-4"
        />
        <button
          type="submit"
          className=" p-2 bg-blue-700 text-white font-bold w-full py-2 rounded hover:bg-blue-800"
        >
          GUARDAR
        </button>
      </form>
    </div>
  );
};

export default StudentPerfilPage;