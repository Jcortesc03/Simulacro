// src/pages/admin/UserFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import SuccessModal from '../../components/ui/SuccessModal';
import api from '../../api/axiosInstance';

// Modal de Error Institucional
const ErrorModal = ({ show, onClose, title, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              variant="primary"
              className="bg-red-600 hover:bg-red-700 px-6"
            >
              Entendido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Lista de programas académicos disponibles
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

  // Mapeo de roles para visualización
  const roleDisplayMapping = {
    'estudiante': 'Estudiante',
    'profesor': 'Profesor',
    'admin': 'Administrador'
  };

  // Estilos institucionales para roles
  const getRoleStyle = (role) => {
    const styles = {
      'estudiante': 'bg-blue-50 text-blue-700 border-blue-200',
      'profesor': 'bg-green-50 text-green-700 border-green-200',
      'admin': 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return styles[role] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getRoleDisplayText = (role) => {
    return roleDisplayMapping[role] || role;
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'estudiante',
    career: '',
    password: '',
    sendNotification: true,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalData, setErrorModalData] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mostrar modal de error
  const showError = (title, message) => {
    setErrorModalData({ title, message });
    setShowErrorModal(true);
  };

  // Cargar usuario si estamos editando
  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
  }, [isEditing, id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
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
          throw new Error('El identificador debe ser un email válido o un número mayor a 0');
        }
        const limit = 100;
        const response = await api.get(`/admin/getPagedUsers?page=1&limit=${limit}`);
        const { users } = response.data;
        if (!users || users.length === 0) throw new Error('No se encontraron usuarios en el sistema');
        const userIndex = targetPosition - 1;
        if (userIndex < 0 || userIndex >= users.length) {
          throw new Error(`El usuario en la posición ${targetPosition} no existe. Solo hay ${users.length} usuarios registrados.`);
        }
        userData = users[userIndex];
      }

      if (!userData) throw new Error(`No se pudo encontrar el usuario con identificador "${id}".`);

      setFormData({
        name: userData.user_name || userData.name || '',
        email: userData.email || '',
        role: userData.role_name || 'estudiante',
        career: userData.program_name || '',
        password: '',
        sendNotification: true,
      });
      setUserFound(true);

    } catch (error) {
      showError('Usuario No Encontrado', error.message || 'No se pudieron cargar los datos del usuario solicitado.');
      setUserFound(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProgramSelect = (program) => {
    setFormData(prev => ({
      ...prev,
      career: program
    }));
    setIsDropdownOpen(false);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showError('Información Requerida', 'El nombre completo del usuario es obligatorio.');
      return false;
    }

    if (!formData.email.trim()) {
      showError('Información Requerida', 'La dirección de correo electrónico es obligatoria.');
      return false;
    }

    if (!isEditing && !formData.password.trim()) {
      showError('Información Requerida', 'La contraseña es obligatoria para crear nuevos usuarios.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError('Formato Incorrecto', 'Por favor, ingrese una dirección de correo electrónico válida.');
      return false;
    }

    if (!isEditing && formData.password.length < 6) {
      showError('Contraseña Insuficiente', 'La contraseña debe contener al menos 6 caracteres por seguridad.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isEditing) {
        await api.patch('/admin/changeRole', {
          email: formData.email,
          roleName: formData.role,
        });
      } else {
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
      let errorTitle = 'Error del Sistema';
      let errorMessage = `No se pudo ${isEditing ? 'actualizar' : 'crear'} el usuario. Por favor, intente nuevamente.`;

      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        // Errores específicos
        if (error.response.status === 409 || errorMessage.includes('already exists') || errorMessage.includes('ya existe')) {
          errorTitle = 'Usuario Existente';
          errorMessage = 'Ya existe un usuario registrado con esta dirección de correo electrónico. Por favor, utilice una dirección diferente.';
        } else if (error.response.status === 400) {
          errorTitle = 'Datos Incorrectos';
          errorMessage = 'Los datos proporcionados no son válidos. Por favor, revise la información ingresada.';
        } else if (error.response.status === 403) {
          errorTitle = 'Sin Autorización';
          errorMessage = 'No tiene los permisos necesarios para realizar esta operación.';
        }
      }

      showError(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/admin/users');
  };

  // Mensaje si no se encuentra el usuario
  if (isEditing && !loading && !userFound) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-8 py-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Usuario No Encontrado</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            El usuario solicitado no se encuentra en el sistema o no tiene permisos para acceder a esta información.
          </p>
          <Button variant="primary" onClick={() => navigate('/admin/users')} className="bg-blue-600">
            Regresar al Listado
          </Button>
        </div>
      </div>
    );
  }

  // Estado de carga
  if (loading && isEditing && !userFound) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-8 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <div className="text-lg text-gray-600">Cargando información del usuario...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing
            ? 'Modifique la información del usuario seleccionado'
            : 'Complete la información para registrar un nuevo usuario en el sistema'
          }
        </p>
      </div>

      {/* Formulario */}
      <div className="px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                  }`}
                  placeholder="Ingrese el nombre completo"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                  }`}
                  placeholder="usuario@institución.edu.co"
                />
              </div>
            </div>
          </div>

          {/* Información Académica */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Académica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol en el Sistema <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="profesor">Profesor</option>
                  <option value="admin">Administrador</option>
                </select>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleStyle(formData.role)}`}>
                    {getRoleDisplayText(formData.role)}
                  </span>
                </div>
              </div>

              {/* Programa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programa Académico
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => !isEditing && setIsDropdownOpen(!isDropdownOpen)}
                    disabled={isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-md text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span>{formData.career || 'Seleccione un programa académico'}</span>
                    {!isEditing && (
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  {isDropdownOpen && !isEditing && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {availablePrograms.map((program) => (
                        <button
                          key={program}
                          type="button"
                          onClick={() => handleProgramSelect(program)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        >
                          {program}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Credenciales - Solo para usuarios nuevos */}
          {!isEditing && (
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Credenciales de Acceso</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña Temporal <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mínimo 6 caracteres"
                />
                <p className="text-sm text-gray-600 mt-2">
                  El usuario deberá cambiar esta contraseña en su primer acceso al sistema.
                </p>
              </div>
            </div>
          )}

          {/* Información para edición */}
          {isEditing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="w-5 h-5 text-blue-600 mt-0.5 mr-3">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Información Importante</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Por políticas de seguridad, los administradores no pueden modificar las contraseñas de otros usuarios.
                    Los usuarios deben gestionar sus contraseñas a través de su perfil personal o mediante el proceso de recuperación de contraseña.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Opciones adicionales */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones Adicionales</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendNotification"
                name="sendNotification"
                checked={formData.sendNotification}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="sendNotification" className="ml-3 text-sm text-gray-700">
                Enviar notificación por correo electrónico al usuario
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end items-center pt-6 gap-4 border-t border-gray-200">
            <Button
              type="button"
              variant="cancel"
              onClick={() => navigate('/admin/users')}
              disabled={loading}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-blue-600 hover:bg-blue-700 px-6"
              disabled={loading}
            >
              {loading
                ? (isEditing ? 'Guardando...' : 'Registrando...')
                : (isEditing ? 'Guardar Cambios' : 'Registrar Usuario')
              }
            </Button>
          </div>
        </form>
      </div>

      {/* Modales */}
      <SuccessModal
        show={showSuccessModal}
        onClose={handleCloseModal}
        message={isEditing ? 'Usuario actualizado correctamente' : 'Usuario registrado correctamente'}
      />

      <ErrorModal
        show={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorModalData.title}
        message={errorModalData.message}
      />

      {/* Overlay para cerrar dropdown */}
      {isDropdownOpen && <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />}
    </div>
  );
};

export default UserFormPage;
