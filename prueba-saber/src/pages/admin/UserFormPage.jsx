import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import SuccessModal from '../../components/ui/SuccessModal';
import Sidebar from '../../components/layout/Sidebar';

const UserFormPage = () => {
  const { id } = useParams(); // Obtiene el 'id' de la URL si existe
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Estudiante',
    career: 'Ingenieria De Software',
    password: '',
    sendNotification: true,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Si estamos editando, simulamos la carga de datos del usuario
  useEffect(() => {
    if (isEditing) {
      // En una app real, aquí harías una llamada a tu API: fetch(`/api/users/${id}`)
      console.log(`Cargando datos para el usuario con ID: ${id}`);
      setFormData({
        name: 'Juan Sanchez',
        email: 'juan@gmail.com',
        role: 'Estudiante',
        career: 'Ingenieria De Software',
        sendNotification: true,
        password: '', // La contraseña no se precarga por seguridad
      });
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos a la API
    console.log('Datos del formulario:', formData);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/users'); // Volver a la lista de usuarios
  };

  return (
    <AdminLayout title={isEditing ? 'EDITAR USUARIO' : 'AÑADIR USUARIOS'}>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nombre */}
          <div>
            <label className="text-lg font-semibold text-gray-700">Nombre:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
          </div>

          {/* Campo Email */}
          <div>
            <label className="text-lg font-semibold text-gray-700">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
          </div>

          {/* Campo Rol */}
          <div>
            <label className="text-lg font-semibold text-gray-700">Rol:</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
              <option>Estudiante</option>
              <option>Profesor</option>
              <option>Admin</option>
            </select>
          </div>
          
          {/* Campo Carrera */}
          <div>
            <label className="text-lg font-semibold text-gray-700">Carrera:</label>
            <input type="text" name="career" value={formData.career} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
          </div>

          {/* Campo Contraseña (solo para añadir) */}
          {!isEditing && (
             <div>
                <label className="text-lg font-semibold text-gray-700">Contraseña:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
             </div>
          )}

          {/* Checkbox */}
          <div className="flex items-center">
            <input type="checkbox" id="sendNotification" name="sendNotification" checked={formData.sendNotification} onChange={handleChange} className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"/>
            <label htmlFor="sendNotification" className="ml-2 block text-sm text-gray-900">Enviar al usuario nuevo un correo electrónico con la información sobre su cuenta</label>
          </div>

          {/* Botones */}
          <div className="flex justify-between items-center pt-6">
             <Button type="button" variant="danger" className="bg-brand-red hover:text-white transition-all duration-200" onClick={() => navigate('/users')}>
                Cancelar
             </Button>
             <Button type="submit" variant="primary" className=" text-black bg-brand-blue hover:text-white transition-all duration-200">
                {isEditing ? 'Aceptar' : '+ Añadir Nuevo usuario'}
             </Button>
          </div>
        </form>
      </div>

      <SuccessModal
        show={showSuccessModal}
        onClose={handleCloseModal}
        message={isEditing ? '¡Usuario actualizado correctamente!' : '¡Usuario añadido correctamente!'}
      />
    </AdminLayout>
  );
};

export default UserFormPage;