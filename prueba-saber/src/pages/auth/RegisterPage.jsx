import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { User } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout title="Regístrate para empezar el simulacro">
        <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-pink-400 to-blue-400 inline-flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <User size={48} className="text-blue-500" />
                </div>
            </div>
        </div>

        <form className="space-y-4">
            <input type="text" placeholder="Nombre Completo" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Carrera" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" placeholder="Correo Electrónico" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" placeholder="Contraseña" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" placeholder="Confirmar Contraseña" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <div className="pt-4 space-y-4">
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Crear Cuenta
                </button>
                <button type="button" onClick={() => navigate('/login')} className="w-full bg-white text-gray-600 border border-gray-300 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                    ← Volver
                </button>
            </div>
        </form>
    </AuthLayout>
  );
};

export default RegisterPage;