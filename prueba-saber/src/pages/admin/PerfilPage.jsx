

const Perfil = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-white min-h-screen">
      <h2 className="text-xl font-semibold mb-2">PERFIL</h2>
      <div className="text-center mb-8">
        <svg className="mx-auto  mb-2" width="80" height="80" fill="none" stroke="black" strokeWidth="2">
          <circle cx="40" cy="30" r="20" />
          <path d="M10 80 Q40 60 70 80" />
        </svg>
        <h3 className="text-lg font-bold text-gray-700">Jorge Perez</h3>
        <p className="text-sm text-gray-500">Administrador</p>
      </div>

      <form className="border rounded-lg p-2 w-full max-w-md shadow text-left">
        <h4 className="text-md font-semibold w-full text-blue-800 mb-3">Cambiar Contraseña</h4>
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

export default Perfil;
