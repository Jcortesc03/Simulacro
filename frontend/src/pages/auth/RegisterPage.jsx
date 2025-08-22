import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { User } from 'lucide-react';
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
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
            <input type="text" name="name" placeholder="Nombre Completo"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   value={formData.name} onChange={handleChange} required />

            <select name="programName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                    value={formData.programName} onChange={handleChange} required>
                <option value="">Selecciona tu carrera</option>
                {carreras.map((carrera, index) => (
                    <option key={index} value={carrera}>
                        {carrera}
                    </option>
                ))}
            </select>

            <input type="email" name="email" placeholder="Correo Electrónico"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Contraseña"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   value={formData.password} onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   value={formData.confirmPassword} onChange={handleChange} required />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="pt-4 space-y-4">
                <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
                <button type="button" onClick={() => navigate('/login')}
                        className="w-full bg-white text-gray-600 border border-gray-300 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                    ← Volver
                </button>
            </div>
        </form>
    </AuthLayout>
  );
};

export default RegisterPage;
