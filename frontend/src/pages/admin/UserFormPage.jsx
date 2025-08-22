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

  // Mapeo de roles inglés -> español para mostrar
  const roleDisplayMapping = {
    'user': 'Usuario',
    'teacher': 'Profesor',
    'admin': 'Administrador'
  };

  // Colores para cada rol
  const getRoleColor = (role) => {
    const colors = {
      'user': 'bg-green-100 text-green-800',
      'teacher': 'bg-blue-100 text-blue-800',
      'admin': 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  // Obtener el texto en español del rol
  const getRoleDisplayText = (role) => {
    return roleDisplayMapping[role] || role;
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    career: '',
    password: '',
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

      // Determinar si el ID es un email o una posición
      const isEmail = id.includes('@');

      console.log('Buscando usuario:', { id, isEmail });

      let userData = null;

      if (isEmail) {
        // Usar el endpoint para buscar por email
        try {
          const decodedEmail = decodeURIComponent(id);
          console.log('Buscando con endpoint específico:', decodedEmail);

          const response = await api.get(`/admin/getUserByEmail/${encodeURIComponent(decodedEmail)}`);

          // El backend devuelve { message: string, user: object }
          if (response.data && response.data.user) {
            userData = response.data.user;
            console.log('Usuario encontrado con endpoint específico:', userData);
          }
        } catch (endpointError) {
          console.log('Error con endpoint específico:', endpointError.response?.data?.message);
          throw new Error(endpointError.response?.data?.message || 'Usuario no encontrado');
        }
      } else {

        const targetPosition = parseInt(id);
        if (isNaN(targetPosition) || targetPosition <= 0) {
          throw new Error('ID debe ser un email válido o un número mayor a 0');
        }

        const limit = 100;
        console.log(`Buscando posición ${targetPosition}`);

        const response = await api.get(`/admin/getPagedUsers?page=1&limit=${limit}`);

        const { users } = response.data;

        if (!users || users.length === 0) {
          throw new Error('No se encontraron usuarios');
        }

        const userIndex = targetPosition - 1;

        if (userIndex < 0 || userIndex >= users.length) {
          throw new Error(`Usuario en posición ${targetPosition} no existe. Solo hay ${users.length} usuarios disponibles.`);
        }

        userData = users[userIndex];
        console.log(`Usuario encontrado en posición ${targetPosition}:`, userData);
      }

      if (!userData) {
        throw new Error(`Usuario "${id}" no encontrado. Verifica que el ID o email sean correctos.`);
      }


      setFormData({
        name: userData.user_name || userData.name || userData.username || '',
        email: userData.email || '',
        role: userData.roles?.role_name || userData.role?.role_name || userData.role_name || userData.role || 'user',
        career: userData.programs?.program_name || userData.program?.program_name || userData.program_name || userData.program || userData.career || '',
        password: '', // nunca se trae la contraseña
        sendNotification: true,
      });

      setUserFound(true);

    } catch (error) {
      console.error('Error loading user data:', error);
      setError(error.message || 'Error al cargar los datos del usuario');
      setUserFound(false);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios de input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  // Manejar selección de programa
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
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!isEditing && !formData.password.trim()) {
      setError('La contraseña es requerida para usuarios nuevos');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('El formato del email no es válido');
      return false;
    }

    // Validar longitud de contraseña si se proporciona
    if (formData.password.trim() && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        console.log('Actualizando usuario:', formData.email);

        // Actualizar contraseña (si se proporciona)
        if (formData.password.trim()) {
          try {
            await api.patch('/auth/changePassword', {
              email: formData.email,
              newPassword: formData.password,
            });
            console.log('Contraseña actualizada');
          } catch (passwordError) {
            console.error('Error actualizando contraseña:', passwordError);
            throw new Error('Error al actualizar la contraseña: ' +
              (passwordError.response?.data?.message || passwordError.message));
          }
        }

        // Actualizar rol
        try {
          await api.patch('/admin/changeRole', {
            email: formData.email,
            roleName: formData.role, // Ya no necesita .toLowerCase()
          });
          console.log('Rol actualizado');
        } catch (roleError) {
          console.error('Error actualizando rol:', roleError);
          const errorMessage = roleError.response?.data?.message ||
                              (typeof roleError.response?.data === 'string' ? roleError.response.data : roleError.message);
          throw new Error('Error al actualizar el rol: ' + errorMessage);
        }

      } else {
        console.log('Creando nuevo usuario:', formData.email);

        // Crear nuevo usuario
        const submitData = {
          email: formData.email,
          name: formData.name,
          password: formData.password,
          programName: formData.career,
        };

        try {
          await api.post('/admin/adminRegister', submitData);
          console.log('Usuario creado');
        } catch (createError) {
          console.error('Error creando usuario:', createError);
          const errorMessage = createError.response?.data?.message ||
                              (typeof createError.response?.data === 'string' ? createError.response.data : createError.message);
          throw new Error('Error al crear el usuario: ' + errorMessage);
        }

        // Si el rol no es "user", cambiarlo después de crear
        if (formData.role !== 'user') {
          try {
            await api.patch('/admin/changeRole', {
              email: formData.email,
              roleName: formData.role,
            });
            console.log('Rol asignado');
          } catch (roleError) {
            console.error('Error asignando rol:', roleError);
            // Solo advertencia, el usuario ya fue creado
            console.warn('Usuario creado pero no se pudo asignar el rol:', roleError.message);
          }
        }
      }

      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el usuario`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/admin/users');
  };

  // Mensaje de error si no se encuentra el usuario
  if (isEditing && !loading && !userFound && error) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Usuario No Encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/users')}
          >
            Volver a la Lista
          </Button>
        </div>
      </div>
    );
  }

  // Loader mientras carga usuario
  if (loading && isEditing && !userFound) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <div className="text-lg text-gray-600">
            Cargando datos del usuario...
          </div>
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
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isEditing && userFound && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <p className="text-sm">
            <strong>Nota:</strong> Solo se pueden modificar el rol y la contraseña.
            Para cambiar el nombre o programa, contacta al administrador del sistema.
          </p>
        </div>
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
          {isEditing && (
            <p className="text-xs text-gray-500 mt-1">
              El nombre no se puede modificar desde esta interfaz
            </p>
          )}
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
          {isEditing && (
            <p className="text-xs text-gray-500 mt-1">
              El email no se puede modificar
            </p>
          )}
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
            <option value="user">Usuario</option>
            <option value="teacher">Profesor</option>
            <option value="admin">Administrador</option>
          </select>

          {/* Mostrar el rol actual con color */}
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(formData.role)}`}>
              {getRoleDisplayText(formData.role)}
            </span>
          </div>
        </div>

        {/* Programa/Carrera con Dropdown */}
        <div>
          <label className="text-lg font-semibold text-gray-700">
            Programa/Carrera:
          </label>
          <div className="relative mt-1">
            <button
              type="button"
              onClick={() => !isEditing && setIsDropdownOpen(!isDropdownOpen)}
              disabled={isEditing}
              className={`w-full p-2 border border-gray-300 rounded-md text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={formData.career ? 'text-gray-900' : 'text-gray-500'}>
                  {formData.career || 'Selecciona un programa'}
                </span>
                {!isEditing && (
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && !isEditing && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="py-1">
                  {availablePrograms.map((program) => (
                    <button
                      key={program}
                      type="button"
                      onClick={() => handleProgramSelect(program)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-900 ${
                        formData.career === program
                          ? 'bg-blue-100 text-blue-900 font-medium'
                          : 'text-gray-900'
                      }`}
                    >
                      {program}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mostrar programa seleccionado */}
          {formData.career && (
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {formData.career}
              </span>
            </div>
          )}

          {isEditing && (
            <p className="text-xs text-gray-500 mt-1">
              El programa no se puede modificar desde esta interfaz
            </p>
          )}
        </div>

        {/* Contraseña */}
        {!isEditing ? (
          <div>
            <label className="text-lg font-semibold text-gray-700">
              Contraseña:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 6 caracteres
            </p>
          </div>
        ) : (
          <div>
            <label className="text-lg font-semibold text-gray-700">
              Nueva Contraseña (opcional):
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Dejar en blanco para mantener la contraseña actual"
              minLength={6}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si cambias la contraseña, debe tener mínimo 6 caracteres
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
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="sendNotification"
            className="ml-2 block text-sm text-gray-900"
          >
            Enviar al usuario un correo electrónico con la información sobre su cuenta
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end items-center pt-6 gap-4">
          <Button
            type="button"
            variant="cancel"
            onClick={() => navigate('/admin/users')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="bg-blue-600"
            disabled={loading}
          >
            {loading
              ? isEditing
                ? 'Guardando...'
                : 'Añadiendo...'
              : isEditing
              ? 'Guardar Cambios'
              : 'Añadir Usuario'}
          </Button>
        </div>
      </form>

      <SuccessModal
        show={showSuccessModal}
        onClose={handleCloseModal}
        message={
          isEditing
            ? '¡Usuario actualizado correctamente!'
            : '¡Usuario añadido correctamente!'
        }
      />

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default UserFormPage;
