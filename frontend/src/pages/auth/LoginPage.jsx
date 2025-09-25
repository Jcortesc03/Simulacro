import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from "../../context/useAuth";

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); // Se usa como email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
 // const decodedUser = jwtDecode(token);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    
    try {
      const response = await api.post('/auth/login', {
        email: username,
        password: password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const decodedUser = jwtDecode(token);
        
      
        // Guardamos el usuario en el estado global. Es importante que el objeto
        // que guardamos aquí tenga una propiedad 'role' con el valor correcto.
        setUser({
          id: decodedUser.user_id,
          name: decodedUser.name,
          email: decodedUser.email,
          role: decodedUser.role 
        });
        
        // --- LÓGICA DE REDIRECCIÓN CORREGIDA ---
        // Convertimos el rol a string para manejar ambos casos (número o texto).
        const userRole = String(decodedUser.role);

        switch (userRole) {
          case '3': // Rol de Admin
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case '2': // Rol de Teacher
          case 'teacher':
            navigate('/teacher/categories');
            break;
          case '1': // Rol de Student
          case 'student':
            navigate('/student/inicio');
            break;
          default:
            // Si el rol no es reconocido, limpiamos todo para seguridad.
            setError("Rol de usuario no reconocido. Contacte al administrador.");
            localStorage.removeItem('token');
            setUser(null);
        }
      } else {
        setError("El servidor no devolvió un token de autenticación.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Credenciales inválidas.';
      setError(errorMessage);
    } finally {
      setLoading(false);
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
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center space-y-4 text-sm sm:flex-row sm:justify-between sm:space-y-0">
          <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Recordarme</span>
          </label>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            ¿Olvidaste la contraseña?
          </a>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'INGRESAR'}
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