// src/pages/admin/UsersPage.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { PlusCircle, Edit, Trash2, User, Search } from 'lucide-react';

const initialUsers = [
  { id: 1, name: 'Juan Sanchez', email: 'juan@gmail.com', role: 'Estudiante' },
  { id: 2, name: 'Ana Castillo', email: 'ana@gmail.com', role: 'Profesor' },
  { id: 3, name: 'Pedro Gomez', email: 'pedro@gmail.com', role: 'Estudiante' },
  { id: 4, name: 'Luisa Martinez', email: 'luisa@gmail.com', role: 'Admin' },
];

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [modalState, setModalState] = useState({ isOpen: false, userId: null });
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenDeleteModal = (userId) => setModalState({ isOpen: true, userId });
  const handleCloseDeleteModal = () => setModalState({ isOpen: false, userId: null });
  const handleConfirmDelete = () => {
    setUsers(users => users.filter(user => user.id !== modalState.userId));
    handleCloseDeleteModal();
  };
  
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  return (
    <Card>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button onClick={() => navigate('/admin/users/add')} variant="primary" className="w-full md:w-auto bg-blue-600 flex-shrink-0">
          <PlusCircle className="inline md:mr-2" />
          <span className="hidden md:inline">Añadir Nuevo</span>
        </Button>
      </div>
      
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nombre</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Rol</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="p-4 text-gray-800 font-medium">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4 text-gray-600">{user.role}</td>
                <td className="p-4 flex justify-center space-x-2">
                  <button onClick={() => navigate(`/admin/users/edit/${user.id}`)} className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors" title="Editar"><Edit size={20} /></button>
                  <button onClick={() => handleOpenDeleteModal(user.id)} className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors" title="Eliminar"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredUsers.map((user) => (
          <div key={user.id} className="border-2 rounded-lg p-4 flex items-center justify-between space-x-2 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 flex-grow overflow-hidden">
              <User className="text-gray-500 flex-shrink-0" size={24}/>
              <div className="overflow-hidden">
                <p className="font-bold text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <p className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full inline-block mt-1">{user.role}</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-3 flex-shrink-0">
              <button onClick={() => navigate(`/admin/users/edit/${user.id}`)} className="text-gray-500 hover:text-blue-600"><Edit size={20} /></button>
              <button onClick={() => handleOpenDeleteModal(user.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
      
      <ConfirmationModal
        show={modalState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."
      />
    </Card>
  );
};
export default UsersPage;