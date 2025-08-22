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

  const [formData, setFormData] = useState({
    name: '', email: '', role: 'user', career: '', password: '', sendNotification: true,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
  }, [isEditing, id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      // Para obtener usuarios individuales necesitarías un endpoint específico
      // Por ahora usamos getPagedUsers y filtramos (no es ideal pero funcional)
      const response = await api.get('/admin/getPagedUsers?page=1&limit=100');
      const { users } = response.data;
      const userData = users.find(user => user.id === id || user.email === id);
      
      if (!userData) {
        throw new Error('Usuario no encontrado');
      }
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'user', // Basado en la doc: "user", "admin", etc.
        career: userData.programName || '', // En la API se llama programName
        password: '', // Don't load existing password
        sendNotification: true,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        // Para actualizar, necesitas diferentes endpoints según qué cambies
        if (formData.password) {
          // Cambiar contraseña
          await api.patch('/auth/changePassword', {
            email: formData.email,
            newPassword: formData.password
          });
        }
        
        // Cambiar rol si es necesario
        await api.patch('/admin/changeRole', {
          email: formData.email,
          roleName: formData.role.toLowerCase() // "user", "admin", etc.
        });
        
        // Nota: No hay endpoint para actualizar nombre o carrera en la documentación
        // Tendrías que pedirle al backend que agregue esos endpoints
        
      } else {
        // Crear nuevo usuario usando adminRegister
        const submitData = {
          email: formData.email,
          name: formData.name,
          password: formData.password,
          programName: formData.career // En la API se llama programName
        };
        
        await api.post('/admin/adminRegister', submitData);
        
        // Si el rol no es "user" por defecto, cambiarlo después
        if (formData.role.toLowerCase() !== 'user') {
          await api.patch('/admin/changeRole', {
            email: formData.email,
            roleName: formData.role.toLowerCase()
          });
        }
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(
        error.response?.data?.message || 
        `Error al ${isEditing ? 'actualizar' : 'crear'} el usuario`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/admin/users');
  };

  if (loading && isEditing && !formData.name) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-32">
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
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-lg font-semibold text-gray-700">Nombre:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-lg font-semibold text-gray-700">Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

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
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="text-lg font-semibold text-gray-700">Programa/Carrera:</label>
          <input 
            type="text" 
            name="career" 
            value={formData.career} 
            onChange={handleChange} 
            placeholder="Ej: Ingeniería de Sistemas, Medicina, etc."
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {!isEditing ? (
          <div>
            <label className="text-lg font-semibold text-gray-700">Contraseña:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ) : (
          <div>
            <label className="text-lg font-semibold text-gray-700">Nueva Contraseña (opcional):</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Dejar en blanco para mantener la contraseña actual"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="sendNotification" 
            name="sendNotification" 
            checked={formData.sendNotification} 
            onChange={handleChange} 
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="sendNotification" className="ml-2 block text-sm text-gray-900">
            Enviar al usuario nuevo un correo electrónico con la información sobre su cuenta
          </label>
        </div>

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
              ? (isEditing ? 'Guardando...' : 'Añadiendo...') 
              : (isEditing ? 'Guardar Cambios' : 'Añadir Usuario')
            }
          </Button>
        </div>
      </form>

      <SuccessModal
        show={showSuccessModal}
        onClose={handleCloseModal}
        message={isEditing ? '¡Usuario actualizado correctamente!' : '¡Usuario añadido correctamente!'}
      />
    </div>
  );
};

export default UserFormPage;