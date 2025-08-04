// src/pages/auth/LoginPage.jsx

import React, { useState } from 'react'; // ¡ESTA ES LA LÍNEA CORREGIDA!
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { User, Lock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Intentando iniciar sesión con Usuario: ${username}`);

    if (username.toLowerCase() === 'admin') {
      navigate('/admin/dashboard');
    } else if (username.toLowerCase() === 'teacher') {
      console.log('Login de profesor aún no implementado');
    } else {
      navigate('/student/inicio');
    }
  };

  return (
    <AuthLayout title="Simulacro Prueba Saber Pro">
      <div className="text-center mb-4 md:mb-4">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-br from-pink-400 to-blue-400 inline-flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <User size={40} className="text-blue-500 md:size-48" />
            </div>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Nombre de Usuario" 
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center space-y-4 text-sm sm:flex-row sm:justify-between sm:space-y-0">
          <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Recordar contraseña</span>
          </label>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">¿Olvidaste la contraseña?</a>
        </div>

        <div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
            INGRESAR
          </button>
        </div>
        <div>
          <button type="button" onClick={() => navigate('/register')} className="w-full bg-white text-blue-600 border-2 border-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors">
            CREAR CUENTA
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;