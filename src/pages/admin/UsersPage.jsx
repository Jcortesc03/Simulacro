// src/pages/admin/UsersPage.jsx
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { PlusCircle, Edit, Trash2, User, Search } from 'lucide-react';
import api from '../../api/axiosInstance';

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, userId: null });
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Cargar usuarios desde el backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await api.get('/admin/getPagedUsers?page=1&limit=100');
        console.log("=== INFORMACIÓN DE DEPURACIÓN ===");
        console.log("1. Respuesta completa:", res);
        console.log("2. Código de estado:", res.status);
        console.log("3. res.data:", res.data);
        console.log("4. Tipo de res.data:", typeof res.data);
        console.log("5. ¿res.data es array?:", Array.isArray(res.data));
        
        if (res.data) {
          console.log("6. Propiedades de res.data:", Object.keys(res.data));
          
          // Revisar diferentes posibles ubicaciones de los datos
          console.log("7. res.data.data:", res.data.data);
          console.log("8. res.data.users:", res.data.users);
          console.log("9. res.data.result:", res.data.result);
          console.log("10. res.data.rows:", res.data.rows);
        }
        
        // Verifica la estructura de la respuesta de manera más flexible
        let usersArray = [];
        
        if (res.data && Array.isArray(res.data.data)) {
          console.log("✅ Usando res.data.data");
          usersArray = res.data.data;
        } else if (res.data && Array.isArray(res.data.users)) {
          console.log("✅ Usando res.data.users");
          usersArray = res.data.users;
        } else if (res.data && Array.isArray(res.data.result)) {
          console.log("✅ Usando res.data.result");
          usersArray = res.data.result;
        } else if (res.data && Array.isArray(res.data.rows)) {
          console.log("✅ Usando res.data.rows");
          usersArray = res.data.rows;
        } else if (res.data && Array.isArray(res.data)) {
          console.log("✅ Usando res.data directamente");
          usersArray = res.data;
        } else {
          console.log("❌ No se encontró array de usuarios en ninguna ubicación esperada");
          console.log("Estructura completa de res.data:", JSON.stringify(res.data, null, 2));
          
          // En lugar de lanzar error, usar un array vacío temporalmente
          usersArray = [];
          setError('No se encontraron usuarios o la estructura de datos es inesperada. Revisa la consola para más detalles.');
        }

        console.log("11. Array de usuarios final:", usersArray);
        console.log("12. Cantidad de usuarios:", usersArray.length);

        // Mapear los datos según la estructura que recibes
        if (usersArray.length > 0) {
          console.log("13. Primer usuario de ejemplo:", usersArray[0]);
          console.log("14. Propiedades del primer usuario:", Object.keys(usersArray[0]));
        }

        const mapped = usersArray.map((user, index) => {
          console.log(`15. Procesando usuario ${index + 1}:`, user);
          return {
            id: user.user_id || user.id || index,
            name: user.user_name || user.name || user.username || 'Sin nombre',
            email: user.email || 'Sin email',
            role: user.roles?.role_name || user.role?.role_name || user.role_name || user.role || 'Sin rol',
            program: user.programs?.program_name || user.program?.program_name || user.program_name || user.program || 'Sin programa',
            registrationDate: user.registration_date ? 
              new Date(user.registration_date).toLocaleDateString('es-ES') : 
              user.created_at ?
              new Date(user.created_at).toLocaleDateString('es-ES') :
              'No disponible'
          };
        });

        console.log("16. Usuarios mapeados:", mapped);
        console.log("=== FIN DEPURACIÓN ===");
        setUsers(mapped);
        
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        setError('Error al cargar los usuarios. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenDeleteModal = (userId) => setModalState({ isOpen: true, userId });
  const handleCloseDeleteModal = () => setModalState({ isOpen: false, userId: null });

  // ⚠️ Implementar eliminación real
  const handleConfirmDelete = async () => {
    try {
      // Aquí iría la petición al backend para eliminar
      // await api.delete(`/admin/users/${modalState.userId}`);
      
      console.log(`Eliminando usuario con ID: ${modalState.userId}`);
      
      // Actualizar el estado local (temporal hasta implementar el backend)
      setUsers(users => users.filter(user => user.id !== modalState.userId));
      handleCloseDeleteModal();
      
      // Aquí podrías mostrar un mensaje de éxito
      
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError('Error al eliminar el usuario. Por favor, intenta de nuevo.');
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.program?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  // Mostrar loading
  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </Card>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="primary"
          >
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

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
        <Button
          onClick={() => navigate('/admin/users/add')}
          variant="primary"
          className="w-full md:w-auto bg-blue-600 flex-shrink-0"
        >
          <PlusCircle className="inline md:mr-2" />
          <span className="hidden md:inline">Añadir Nuevo</span>
        </Button>
      </div>

      {/* Mostrar información de depuración */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm text-gray-600">
        Usuarios cargados: {users.length} | Filtrados: {filteredUsers.length}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          {users.length === 0 ? (
            <p className="text-gray-600">No hay usuarios registrados</p>
          ) : (
            <p className="text-gray-600">No se encontraron usuarios con ese criterio de búsqueda</p>
          )}
        </div>
      ) : (
        <>
          {/* Tabla para desktop */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">ID</th>
                  <th className="p-4 font-semibold text-gray-600">Nombre</th>
                  <th className="p-4 font-semibold text-gray-600">Email</th>
                  <th className="p-4 font-semibold text-gray-600">Rol</th>
                  <th className="p-4 font-semibold text-gray-600">Programa</th>
                  <th className="p-4 font-semibold text-gray-600">Registrado</th>
                  <th className="p-4 font-semibold text-gray-600 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="p-4 text-gray-600 text-sm">{user.id}</td>
                    <td className="p-4 text-gray-800 font-medium">{user.name}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{user.program}</td>
                    <td className="p-4 text-gray-600">{user.registrationDate}</td>
                    <td className="p-4 flex justify-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                        className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(user.id)}
                        className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas para móvil */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border-2 rounded-lg p-4 flex items-center justify-between space-x-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-grow overflow-hidden">
                  <User className="text-gray-500 flex-shrink-0" size={24} />
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    <p className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full inline-block mt-1">
                      {user.role}
                    </p>
                    {user.program && user.program !== 'Sin programa' && (
                      <p className="text-xs text-gray-500 mt-1">Programa: {user.program}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">ID: {user.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-3 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(user.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

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