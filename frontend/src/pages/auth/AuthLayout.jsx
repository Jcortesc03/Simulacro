const AuthLayout = ({ children, title, subtitle }) => {
  return (
    // Fondo azul oscuro con una imagen de fondo sutil
    <div className="min-h-screen bg-[#1E3A8A] bg-cover bg-center flex flex-col items-center justify-center p-4 sm:p-6 md:p-8" 
         style={{ backgroundImage: 'url(../../../public/auth-background.jpg.png)' }}> {/* Asegúrate de tener esta imagen en /public */}
      
      <header className="text-center mb-6 md:mb-8">
        <img src="../../../public/logo-universidad.png.png" alt="Logo" className=" mx-auto h-25 md:h-25 mb-4" /> {/* Logo en /public */}
        <h1 className="text-1xl md:text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-gray-300 mt-2">{subtitle}</p>}
      </header>
      
      <main className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;