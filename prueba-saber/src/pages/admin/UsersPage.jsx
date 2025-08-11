import { useState, useMemo } from 'react'; // Añadimos useMemo para la búsqueda
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { Plus, Edit, Trash2, User, Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  const handleOpenDeleteModal = (userId) => {
    setModalState({ isOpen: true, userId: userId });
  };

  const handleCloseDeleteModal = () => {
    setModalState({ isOpen: false, userId: null });
  };

  const handleConfirmDelete = () => {
    console.log(`Borrando usuario con ID: ${modalState.userId}`);
    setUsers(currentUsers => currentUsers.filter(user => user.id !== modalState.userId));
    handleCloseDeleteModal();
  };
  
  // Lógica para filtrar los usuarios
  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);


  return (
    <AdminLayout title="USUARIOS">
      <Card>
        {/* --- BARRA SUPERIOR RESPONSIVE Y FUNCIONAL --- */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative w-full flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, email o rol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
          </div>
          <button 
            onClick={() => navigate('/users/add')} 
            className="w-full md:w-auto flex-shrink-0 bg-brand-blue text-black rounded-lg h-12 px-4 flex items-center justify-center font-semibold hover:bg-blue-700 hover:text-white transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span className="ml-2">Añadir Nuevo</span>
          </button>
        </div>
        
        {/* --- TABLA PARA DESKTOP --- */}
        {/* La clase 'hidden md:table' es la clave para el responsive */}
        <table className="w-full text-left hidden md:table hover:text-white">
          <thead className="bg-light-gray">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nombre</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Rol</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-200">
                <td className="p-4 text-gray-800">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4 text-gray-600">{user.role}</td>
                <td className="p-4 flex justify-center space-x-4">
                  <button onClick={() => navigate(`/users/edit/${user.id}`)} className="p-2 rounded-full text-gray-600 hover:bg-blue-200 hover:text-brand-blue hover:scale-110 transition-all duration-200" title="Editar"><Edit size={20} /></button>
                  <button onClick={() => handleOpenDeleteModal(user.id)} className="p-2 rounded-full text-gray-600 hover:bg-red-200 hover:text-brand-red hover:scale-110 transition-all duration-200" title="Eliminar"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- VISTA DE TARJETAS PARA MÓVIL --- */}
        {/* La clase 'md:hidden' hace que solo se vea en móvil */}
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
                        <button onClick={() => navigate(`/users/edit/${user.id}`)} className="text-black hover:text-brand-blue hover:text-white"><Edit size={20} /></button>
                        <button onClick={() => handleOpenDeleteModal(user.id)} className="text-gray-600 hover:text-brand-red hover:text-white"><Trash2 size={20} /></button>
                    </div>
                </div>
            ))}
        </div>
      </Card>
      
      <ConfirmationModal
        show={modalState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."
      />
    </AdminLayout>
  );
};

export default UsersPage;