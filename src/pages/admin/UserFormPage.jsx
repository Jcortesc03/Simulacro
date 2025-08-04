// src/pages/admin/UserFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import SuccessModal from '../../components/ui/SuccessModal';

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '', email: '', role: 'Estudiante', career: '', password: '', sendNotification: true,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (isEditing) {
      console.log(`Cargando datos para el usuario con ID: ${id}`);
      setFormData({
        name: 'Juan Sanchez', email: 'juan@gmail.com', role: 'Estudiante', career: 'Ingenieria De Software', sendNotification: true, password: '',
      });
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/admin/users');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-lg font-semibold text-gray-700">Nombre:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
        </div>
        <div>
          <label className="text-lg font-semibold text-gray-700">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
        </div>
        <div>
          <label className="text-lg font-semibold text-gray-700">Rol:</label>
          <select name="role" value={formData.role} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
            <option>Estudiante</option>
            <option>Profesor</option>
            <option>Admin</option>
          </select>
        </div>
        <div>
          <label className="text-lg font-semibold text-gray-700">Carrera:</label>
          <input type="text" name="career" value={formData.career} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
        </div>
        {!isEditing && (
           <div>
              <label className="text-lg font-semibold text-gray-700">Contraseña:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
           </div>
        )}
        <div className="flex items-center">
          <input type="checkbox" id="sendNotification" name="sendNotification" checked={formData.sendNotification} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
          <label htmlFor="sendNotification" className="ml-2 block text-sm text-gray-900">Enviar al usuario nuevo un correo electrónico con la información sobre su cuenta</label>
        </div>
        <div className="flex justify-end items-center pt-6 gap-4">
           <Button type="button" variant="cancel" onClick={() => navigate('/admin/users')}>
              Cancelar
           </Button>
           <Button type="submit" variant="primary" className="bg-blue-600">
              {isEditing ? 'Guardar Cambios' : 'Añadir Usuario'}
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