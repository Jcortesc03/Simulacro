// src/pages/admin/UsersPage.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import {
  PlusCircle,
  Edit,
  Trash2,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../api/axiosInstance";

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    userId: null,
    userEmail: null,
    userName: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const usersPerPage = 10;

  // Función para traducir roles
  const translateRole = (role) => {
    const roleTranslations = {
      admin: "Administrador",
      teacher: "Profesor",
      student: "Estudiante",
      Administrador: "Administrador",
      Profesor: "Profesor",
      Estudiante: "Estudiante",
    };
    return roleTranslations[role] || role;
  };

  // Cargar usuarios desde el backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/admin/getPagedUsers?page=1&limit=100");
        let usersArray =
          res.data.users ||
          res.data.data ||
          res.data.result ||
          res.data.rows ||
          res.data ||
          [];

        if (!Array.isArray(usersArray)) {
          usersArray = [];
          setError(
            "No se encontraron usuarios o la estructura de datos es inesperada."
          );
        }

        // CORRECCIÓN: Mapeo mejorado con fallback para ID
        const mapped = usersArray.map((user, index) => ({
          // ID de posición (empieza en 1) para navegación
          positionId: index + 1,
          // ID real de la base de datos con fallback
          id: user.user_id || user.id || user.email || index + 1,
          name: user.user_name || user.name || user.username || "Sin nombre",
          email: user.email || "Sin email",
          role: translateRole(
            user.roles?.role_name ||
              user.role?.role_name ||
              user.role_name ||
              user.role ||
              "Sin rol"
          ),
          program:
            user.programs?.program_name ||
            user.program?.program_name ||
            user.program_name ||
            user.program ||
            "Sin programa",
          verified: user.verified === 1 ? "Sí" : "No",
        }));

        setUsers(mapped);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setError("Error al cargar los usuarios. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // CORRECCIÓN: Usar email como identificador principal
  const handleOpenDeleteModal = (userEmail, userName) => {
    console.log("Opening delete modal for:", { userEmail, userName });
    setModalState({
      isOpen: true,
      userId: userEmail, // Usar email como ID único
      userEmail,
      userName,
    });
  };

  const handleCloseDeleteModal = () => {
    setModalState({
      isOpen: false,
      userId: null,
      userEmail: null,
      userName: null,
    });
    setDeleting(false);
  };

  // CORRECCIÓN: Método de eliminación mejorado
  const handleConfirmDelete = async () => {
    if (!modalState.userEmail) {
      console.error("Missing user email for deletion");
      setError("No se encontró el email del usuario para eliminar.");
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      console.log("Deleting user:", modalState.userEmail);

      const response = await api.request({
        method: "DELETE",
        url: "/admin/deleteUser",
        data: { email: modalState.userEmail },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response:", response);

      // CORRECCIÓN: Filtrar por email en lugar de ID
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter(
          (user) => user.email !== modalState.userEmail
        );
        console.log("Users after deletion:", updatedUsers.length);
        return updatedUsers;
      });

      handleCloseDeleteModal();
      console.log("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);

      let errorMessage =
        "Error al eliminar el usuario. Por favor, intenta de nuevo.";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.status === 404) {
        errorMessage = "Usuario no encontrado.";
      } else if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para eliminar este usuario.";
      } else if (error.response?.status === 401) {
        errorMessage =
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
      } else if (error.message) {
        errorMessage = `Error de conexión: ${error.message}`;
      }

      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  // Filtrar usuarios basado en la búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const searchTermLower = searchTerm.toLowerCase().trim();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower) ||
        user.role.toLowerCase().includes(searchTermLower) ||
        (user.program && user.program.toLowerCase().includes(searchTermLower))
    );
  }, [searchTerm, users]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Resetear página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Ajustar página actual si es mayor que el total después de filtrar
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

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

  return (
    <Card>
      {/* Mostrar error si existe */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto flex-grow">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre, email, rol o programa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          onClick={() => navigate("/admin/users/new")}
          variant="primary"
          className="w-full md:w-auto bg-blue-600 flex-shrink-0"
        >
          <PlusCircle className="inline md:mr-2" />
          <span className="hidden md:inline">Añadir Nuevo</span>
        </Button>
      </div>

      {/* Mostrar información de paginación */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm text-gray-600 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div>
          Total usuarios: {users.length} | Filtrados: {filteredUsers.length}
        </div>
        {filteredUsers.length > 0 && (
          <div>
            Mostrando {startIndex + 1} -{" "}
            {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length}
          </div>
        )}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          {users.length === 0 ? (
            <p className="text-gray-600">No hay usuarios registrados</p>
          ) : (
            <p className="text-gray-600">
              No se encontraron usuarios con ese criterio de búsqueda
            </p>
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
                  <th className="p-4 font-semibold text-gray-600">
                    Verificado
                  </th>
                  <th className="p-4 font-semibold text-gray-600 text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-slate-50">
                    <td className="p-4 text-gray-600 text-sm">
                      {user.positionId}
                    </td>
                    <td className="p-4 text-gray-800 font-medium">
                      {user.name}
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "Administrador"
                            ? "bg-red-100 text-red-800"
                            : user.role === "Profesor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{user.program}</td>
                    <td className="p-4 text-gray-600">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.verified === "Sí"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.verified}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/users/edit/${user.positionId}`)
                        }
                        className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        title="Editar"
                        disabled={deleting}
                      >
                        <Edit size={20} />
                      </button>
                      {/* CORRECCIÓN: Pasar email y name */}
                      <button
                        onClick={() =>
                          handleOpenDeleteModal(user.email, user.name)
                        }
                        className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar"
                        disabled={deleting}
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
            {paginatedUsers.map((user) => (
              <div
                key={user.email}
                className="border-2 rounded-lg p-4 flex items-center justify-between space-x-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-grow overflow-hidden">
                  <User className="text-gray-500 flex-shrink-0" size={24} />
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                    <p
                      className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                        user.role === "Administrador"
                          ? "bg-red-100 text-red-800"
                          : user.role === "Profesor"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </p>
                    {user.program && user.program !== "Sin programa" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Programa: {user.program}
                      </p>
                    )}
                    <p className="text-xs mt-1">
                      Verificado:{" "}
                      <span
                        className={
                          user.verified === "Sí"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {user.verified}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ID: {user.positionId}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-3 flex-shrink-0">
                  <button
                    onClick={() =>
                      navigate(`/admin/users/edit/${user.positionId}`)
                    }
                    className="text-gray-500 hover:text-blue-600 disabled:opacity-50"
                    disabled={deleting}
                  >
                    <Edit size={20} />
                  </button>
                  {/* CORRECCIÓN: Pasar email y name */}
                  <button
                    onClick={() => handleOpenDeleteModal(user.email, user.name)}
                    className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                    disabled={deleting}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Componente de Paginación - Centrado */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span className="hidden md:inline">Anterior</span>
                </button>

                <div className="hidden md:flex items-center space-x-1">
                  {getPageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <div className="md:hidden text-sm text-gray-600 px-3">
                  {currentPage} / {totalPages}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="hidden md:inline">Siguiente</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* CORRECCIÓN: Modal mejorado con nombre de usuario */}
      <ConfirmationModal
        show={modalState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que quieres eliminar al usuario "${
          modalState.userName || modalState.userEmail
        }"? Esta acción no se puede deshacer.`}
        confirmText={deleting ? "Eliminando..." : "Eliminar"}
        confirmDisabled={deleting}
      />
    </Card>
  );
};

export default UsersPage;
