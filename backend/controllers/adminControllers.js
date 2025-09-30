import db from '../database/admin.js';
import bcrypt from 'bcrypt';
import id from '../utils/uuid.js';
// La importación de generateToken ya no es necesaria aquí si solo se usa para el registro
// import generateToken from '../utils/generateToken.js'; 
import { logAction } from '../services/auditService.js'; // <-- Importación clave del servicio de auditoría

const deleteUserHandler = async (req, res) => {
  try {
    const { email } = req.body;
    // Es buena práctica verificar que el usuario a eliminar existe antes de auditar
    const userToDelete = await db.getUserByEmail(email); // Asumiendo que tienes una función así en admin.js
    if (!userToDelete) {
      return res.status(404).send('Usuario no encontrado.');
    }

    await db.deleteUser(email);

    // --- REGISTRA LA ACCIÓN ---
    await logAction(
      req.user, // El admin que realiza la acción
      'DELETE_USER', // Tipo de acción
      `Eliminó al usuario: ${userToDelete.user_name} (Email: ${email})`, // Detalles
      req.ip // Dirección IP
    );

    return res.status(200).send('Usuario eliminado con éxito');
  } catch(err) {
    console.log(err);
    return res.status(400).send('Hubo un error eliminando el usuario');
  }
};

const changeRoleHandler = async (req, res) => {
  try {
    const { email, roleName } = req.body;

    if (!email || !roleName) {
      return res.status(400).send('Faltan parámetros: email o roleName');
    }

    await db.changeRole(email, roleName);

    // --- REGISTRA LA ACCIÓN ---
    await logAction(
      req.user,
      'CHANGE_ROLE',
      `Cambió el rol del usuario con email ${email} a '${roleName}'`,
      req.ip
    );

    res.status(200).send('Usuario modificado con éxito');
  } catch (err) {
    console.error("Error en changeRoleHandler:", err.message);
    return res.status(400).send('Hubo un error cambiando el rol');
  }
};

const adminCreateUserHandler = async (req, res) => {
  try {
    const { password, name, programName, email } = req.body;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const generatedId = id();
    
    // No es necesario generar un token aquí, ya que el admin está creando el usuario
    // const token = generateToken(email, name, 1); 

    await db.adminSaveUser(generatedId, name, hash, programName, email);

    // --- REGISTRA LA ACCIÓN ---
    await logAction(
      req.user,
      'ADMIN_CREATE_USER',
      `Creó un nuevo usuario desde el panel de admin: ${name} (Email: ${email})`,
      req.ip
    );

    res.status(201).send(`Usuario ${name} creado con éxito.`);
  } catch(err) {
    console.log(err);
    return res.status(400).send('Hubo un error');
  };
};

// --- Las siguientes funciones son de solo lectura, por lo que NO necesitan auditoría ---

const getPagedUsersHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const users = await db.getPagedUsers(limit, offset);
    return res.status(200).json({ message: 'Usuarios enviados con éxito.', users }); // Cambiado a .json para consistencia
  } catch (err) {
    console.log(err);
    return res.status(400).send('Hubo un error obteniendo los usuarios');
  }
};

const getUserByEmailHandler = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await db.getUserByEmail(email); // Asumiendo que tienes esta función

    if (user) {
      return res.status(200).json({ message: 'Usuario encontrado con éxito', user });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.log('Error en getUserByEmailHandler:', err);
    return res.status(500).json({ message: 'Error obteniendo el usuario' });
  }
};

const getCategoriesHandler = async (req, res) => {
  try {
    const categories = await db.getCategories();
    return res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error al obtener las categorías' });
  }
};

const getSubCategoriesHandler = async (req, res) => {
  try {
    const subCategories = await db.getSubCategories();
    return res.status(200).json(subCategories);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error al obtener las subcategorías' });
  }
};

const getDashboardStatsHandler = async (req, res) => {
  try {
    const totalUsers = await db.getTotalUsers();
    const totalSimulations = await db.getTotalSimulations();
    const averageScores = await db.getAverageScoresBySubject();
    
    res.status(200).json({
      totalUsers,
      totalSimulations,
      averageScores,
    });
  } catch (err) {
    console.error("Error en getDashboardStatsHandler:", err);
    return res.status(500).send('Hubo un error obteniendo las estadísticas');
  }
};

export default {
  deleteUserHandler,
  changeRoleHandler,
  adminCreateUserHandler,
  getPagedUsersHandler,
  getUserByEmailHandler,
  getCategoriesHandler,
  getSubCategoriesHandler,
  getDashboardStatsHandler
};