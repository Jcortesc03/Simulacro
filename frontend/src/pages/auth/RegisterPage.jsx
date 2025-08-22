import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { User, Eye, EyeOff, Check, X } from 'lucide-react';
import api from '../../api/axiosInstance';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    programName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const carreras = [
    'Administración de Empresas',
    'Arquitectura',
    'Comunicación Social',
    'Contaduría Pública',
    'Derecho',
    'Ingeniería Industrial',
    'Ingeniería de Sistemas',
    'Ingeniería de Software',
    'Psicología',
    'Medicina Veterinaria y Zootecnia'
  ];

  // Validación de longitud de contraseña
  const isPasswordValid = formData.password.length >= 6;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleProgramSelect = (program) => {
    setFormData({
      ...formData,
      programName: program
    });
    setIsDropdownOpen(false);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!isPasswordValid) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.programName) {
      setError('Debes seleccionar un programa');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        programName: formData.programName,
      });
      alert('Usuario creado. Revisa tu correo para verificar.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };



  return (
    <AuthLayout title="Regístrate para empezar el simulacro">
        <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-pink-400 to-blue-400 inline-flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <User size={48} className="text-blue-500" />
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <input
              type="text"
              name="name"
              placeholder="Nombre Completo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Programa/Carrera con Dropdown personalizado */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className={formData.programName ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.programName || 'Selecciona tu carrera'}
                  </span>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <div className="py-1">
                    {carreras.map((carrera) => (
                      <button
                        key={carrera}
                        type="button"
                        onClick={() => handleProgramSelect(carrera)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-900 ${
                          formData.programName === carrera
                            ? 'bg-blue-100 text-blue-900 font-medium'
                            : 'text-gray-900'
                        }`}
                      >
                        {carrera}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Programa seleccionado */}
              {formData.programName && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {formData.programName}
                  </span>
                </div>
              )}
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Contraseña */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña (mínimo 6 caracteres)"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Validación simple de longitud */}
            {formData.password && (
              <div className={`text-xs ${isPasswordValid ? 'text-green-600' : 'text-red-500'}`}>
                {isPasswordValid ? (
                  <div className="flex items-center">
                    <Check size={12} className="mr-1" />
                    Contraseña válida
                  </div>
                ) : (
                  <div className="flex items-center">
                    <X size={12} className="mr-1" />
                    La contraseña debe tener al menos 6 caracteres
                  </div>
                )}
              </div>
            )}

            {/* Confirmar contraseña */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar Contraseña"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-300 focus:ring-red-500'
                    : formData.confirmPassword && formData.password === formData.confirmPassword
                    ? 'border-green-300 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Indicador de coincidencia de contraseñas */}
            {formData.confirmPassword && (
              <div className={`flex items-center text-xs ${
                formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'
              }`}>
                {formData.password === formData.confirmPassword
                  ? <Check size={12} className="mr-1" />
                  : <X size={12} className="mr-1" />
                }
                {formData.password === formData.confirmPassword
                  ? 'Las contraseñas coinciden'
                  : 'Las contraseñas no coinciden'
                }
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={loading || !isPasswordValid || formData.password !== formData.confirmPassword}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full bg-white text-gray-600 border border-gray-300 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    ← Volver
                </button>
            </div>
        </form>

        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
    </AuthLayout>
  );
};

export default RegisterPage;
