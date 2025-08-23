import {  logo, back } from "../../assets/backgraund-login/index";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div
      className="min-h-screen bg-[#1E3A8A] bg-cover bg-center flex flex-col items-center justify-center p-4 sm:p-6 md:p-8"
      style={{ backgroundImage: `url(${back})` }}
    >
      <header className="text-center mb-6 md:mb-8">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto h-24 md:h-28 mb-4"
        />
        <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-gray-300 mt-2">{subtitle}</p>}
      </header>

      <main className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
