import { useState, useEffect } from "react";
import { User, Eye, EyeOff, Save, Mail, Shield } from "lucide-react";
import api from "../../api/axiosInstance";

const PerfilPage = () => {
  // Estados
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Función para obtener el nombre del rol
  const getRoleName = (role) => {
    switch (parseInt(role)) {
      case 1:
        return "Estudiante";
      case 2:
        return "Profesor";
      case 3:
        return "Administrador";
      default:
        return "Sin definir";
    }
  };

  // Función para obtener el color del rol
  const getRoleColor = (role) => {
    switch (parseInt(role)) {
      case 1:
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case 2:
        return "bg-green-50 text-green-700 border border-green-200";
      case 3:
        return "bg-gray-50 text-gray-700 border border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  // Cargar perfil desde el backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("auth/profile");
        if (response.data) {
          setUserName(response.data.name);
          setUserEmail(response.data.email);
          setUserRole(response.data.role);
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
      }
    };
    fetchProfile();
  }, []);

  // Cambiar contraseña (sin validar contraseña actual)
  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    if (passwords.new.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      await api.patch("auth/changePassword", {
        newPassword: passwords.new,
      });
      alert("Contraseña actualizada con éxito");
      setPasswords({ new: "", confirm: "" });
    } catch (err) {
      console.error("Error cambiando contraseña:", err);
      alert("Error cambiando la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case "new":
        return "Nueva contraseña";
      case "confirm":
        return "Confirmar nueva contraseña";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          {/* Header institucional */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Mi Perfil</h1>
                <p className="text-gray-600">Gestiona tu información personal</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Información del usuario */}
            <div className="mb-10">
              <h2 className="text-lg font-medium text-gray-900 mb-6 border-b border-gray-200 pb-3">
                Información Personal
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 font-medium">{userName}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 font-medium">{userEmail}</span>
                  </div>
                </div>

                {/* Rol */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Rol en el sistema
                  </label>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 font-medium">
                      {getRoleName(userRole)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(userRole)}`}>
                      {getRoleName(userRole)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cambio de contraseña */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6 border-b border-gray-200 pb-3">
                Cambiar Contraseña
              </h2>

              <div className="max-w-md space-y-6">
                {["new", "confirm"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {getFieldLabel(field)}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords[field] ? "text" : "password"}
                        value={passwords[field]}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            [field]: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 bg-white"
                        placeholder={`Ingresa tu ${getFieldLabel(field).toLowerCase()}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            [field]: !showPasswords[field],
                          })
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPasswords[field] ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Actualizando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
