// src/pages/admin/UserFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import SuccessModal from '../../components/ui/SuccessModal';
import api from '../../api/axiosInstance';

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Lista de programas disponibles
  const availablePrograms = [
    "Administración de Empresas",
    "Arquitectura",
    "Comunicación Social",
    "Contaduría Pública",
    "Derecho",
    "Ingeniería Industrial",
    "Ingeniería de Sistemas",
    "Ingeniería de Software",
    "Psicología",
    "Medicina Veterinaria y Zootecnia"
  ];

  // Mapeo de roles BD -> español
  const roleDisplayMapping = {
    'estudiante': 'Estudiante',
    'profesor': 'Profesor',
    'admin': 'Administrador'
  };

  // Colores para cada rol
  const getRoleColor = (role) => {
    const colors = {
      'estudiante': 'bg-green-100 text-green-800',
      'profesor': 'bg-blue-100 text-blue-800',
      'admin': 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  // Texto en español del rol
  const getRoleDisplayText = (role) => {
    return roleDisplayMapping[role] || role;
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'estudiante', // default estudiante
    career: '',
    password: '', // Solo para usuarios nuevos
    sendNotification: true,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userFound, setUserFound] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Cargar usuario si estamos editando
  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
  }, [isEditing, id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError('');
      const isEmail = id.includes('@');
      let userData = null;

      if (isEmail) {
        const decodedEmail = decodeURIComponent(id);
        const response = await api.get(`/admin/getUserByEmail/${encodeURIComponent(decodedEmail)}`);
        if (response.data && response.data.user) {
          userData = response.data.user;
        }
      } else {
        const targetPosition = parseInt(id);
        if (isNaN(targetPosition) || targetPosition <= 0) {
          throw new Error('ID debe ser un email válido o un número mayor a 0');
        }
        const limit = 100;
        const response = await api.get(`/admin/getPagedUsers?page=1&limit=${limit}`);
        const { users } = response.data;
        if (!users || users.length === 0) throw new Error('No se encontraron usuarios');
        const userIndex = targetPosition - 1;
        if (userIndex < 0 || userIndex >= users.length) {
          throw new Error(`Usuario en posición ${targetPosition} no existe. Solo hay ${users.length} usuarios disponibles.`);
        }
        userData = users[userIndex];
      }

      if (!userData) throw new Error(`Usuario "${id}" no encontrado.`);

      setFormData({
        name: userData.user_name || userData.name || '',
        email: userData.email || '',
        role: userData.role_name || 'estudiante', // role_name de tu BD
        career: userData.program_name || '',
        password: '', // Siempre vacío para edición
        sendNotification: true,
      });
      setUserFound(true);

    } catch (error) {
      setError(error.message || 'Error al cargar los datos del usuario');
      setUserFound(false);
    } finally {
      setLoading(false);
    }
  };

  // Cambios input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  // Selección programa
  const handleProgramSelect = (program) => {
    setFormData(prev => ({
      ...prev,
      career: program
    }));
    setIsDropdownOpen(false);
    if (error) setError('');
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.name.trim()) return setError('El nombre es requerido'), false;
    if (!formData.email.trim()) return setError('El email es requerido'), false;

    // Solo validar contraseña para usuarios nuevos
    if (!isEditing && !formData.password.trim()) {
      return setError('La contraseña es requerida para usuarios nuevos'), false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return setError('El formato del email no es válido'), false;

    // Solo validar longitud de contraseña para usuarios nuevos
    if (!isEditing && formData.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres'), false;
    }

    return true;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); setError('');

    try {
      if (isEditing) {
        // Solo cambiar el rol - NO cambiar contraseña
        await api.patch('/admin/changeRole', {
          email: formData.email,
          roleName: formData.role, // estudiante, profesor, admin
        });
      } else {
        // Para usuarios nuevos, crear con contraseña
        await api.post('/admin/adminRegister', {
          email: formData.email,
          name: formData.name,
          password: formData.password,
          programName: formData.career,
        });
        if (formData.role !== 'estudiante') {
          await api.patch('/admin/changeRole', {
            email: formData.email,
            roleName: formData.role,
          });
        }
      }
      setShowSuccessModal(true);
    } catch (error) {
      setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el usuario`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/admin/users');
  };

  // Mensaje si no se encuentra el usuario
  if (isEditing && !loading && !userFound && error) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Usuario No Encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate('/admin/users')}>
            Volver a la Lista
          </Button>
        </div>
      </div>
    );
  }

  // Loader
  if (loading && isEditing && !userFound) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <div className="text-lg text-gray-600">Cargando datos del usuario...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Editar Usuario' : 'Añadir Usuario'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="text-lg font-semibold text-gray-700">Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isEditing}
            className={`w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isEditing ? 'bg-gray-100 text-gray-500' : ''
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-lg font-semibold text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isEditing}
            className={`w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isEditing ? 'bg-gray-100 text-gray-500' : ''
            }`}
          />
        </div>

        {/* Rol */}
        <div>
          <label className="text-lg font-semibold text-gray-700">Rol:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
            <option value="admin">Administrador</option>
          </select>

          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(formData.role)}`}>
              {getRoleDisplayText(formData.role)}
            </span>
          </div>
        </div>

        {/* Programa */}
        <div>
          <label className="text-lg font-semibold text-gray-700">Programa/Carrera:</label>
          <div className="relative mt-1">
            <button
              type="button"
              onClick={() => !isEditing && setIsDropdownOpen(!isDropdownOpen)}
              disabled={isEditing}
              className={`w-full p-2 border border-gray-300 rounded-md text-left ${
                isEditing ? 'bg-gray-100 text-gray-500' : 'bg-white'
              }`}
            >
              <span>{formData.career || 'Selecciona un programa'}</span>
            </button>
            {isDropdownOpen && !isEditing && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {availablePrograms.map((program) => (
                  <button
                    key={program}
                    type="button"
                    onClick={() => handleProgramSelect(program)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                  >
                    {program}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contraseña - Solo para usuarios nuevos */}
        {!isEditing && (
          <div>
            <label className="text-lg font-semibold text-gray-700">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Mínimo 6 caracteres
            </p>
          </div>
        )}

        {/* Mensaje informativo para edición */}
        {isEditing && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Los administradores no pueden cambiar contraseñas de otros usuarios.
              Los usuarios deben cambiar sus contraseñas a través de su perfil personal o mediante
              el proceso de recuperación de contraseña.
            </p>
          </div>
        )}

        {/* Notificación */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sendNotification"
            name="sendNotification"
            checked={formData.sendNotification}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="sendNotification" className="ml-2 text-sm text-gray-900">
            Enviar notificación al usuario
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end items-center pt-6 gap-4">
          <Button type="button" variant="cancel" onClick={() => navigate('/admin/users')} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="bg-blue-600" disabled={loading}>
            {loading ? (isEditing ? 'Guardando...' : 'Añadiendo...') : isEditing ? 'Guardar Cambios' : 'Añadir Usuario'}
          </Button>
        </div>
      </form>

      <SuccessModal
        show={showSuccessModal}
        onClose={handleCloseModal}
        message={isEditing ? '¡Usuario actualizado correctamente!' : '¡Usuario añadido correctamente!'}
      />

      {isDropdownOpen && <div className="fixed inset-0 z-0" onClick={() => setIsDropdownOpen(false)} />}
    </div>
  );
};

export default UserFormPage;
