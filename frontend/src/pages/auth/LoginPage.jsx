import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email: username,
        password: password,
      });

      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));

      const { token } = response.data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === '3') {
        navigate('/admin/dashboard');
      } else if (role === '2') {
        navigate('/teacher/simulacros');
      } else {
        navigate('/student/inicio');
      }
    } catch (err) {
      setError(err.response?.data || 'Credenciales inválidas');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            type="email"
            placeholder="Tu correo"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña (mínimo 6 caracteres)"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Validación simple de longitud */}
          {password.length > 0 && password.length < 6 && (
            <div className="text-red-500 text-xs flex items-center">
              <span>La contraseña debe tener al menos 6 caracteres</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center space-y-4 text-sm sm:flex-row sm:justify-between sm:space-y-0">
          <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Recordar contraseña</span>
          </label>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            ¿Olvidaste la contraseña?
          </a>
        </div>

        <div>
          <button
            type="submit"
            disabled={password.length < 6}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            INGRESAR
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="w-full bg-white text-blue-600 border-2 border-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            CREAR CUENTA
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
