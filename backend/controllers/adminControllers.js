import db from '../database/admin.js'
import bcrypt from 'bcrypt';
import id from '../utils/uuid.js';
import generateToken from '../utils/generateToken.js';

const deleteUserHandler = async (req, res) => {
  try {
    const { email } = req.body;
    db.deleteUser(email);
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
    const token = generateToken(email, name, 1);
    await db.adminSaveUser(generatedId, name, hash, programName, email);
    res.status(201).send(`Usuario ${name} creado con éxito.`);
  } catch(err) {
    console.log(err);
    return res.status(400).send('Hubo un error');
  };
};

const getPagedUsersHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const users = await db.getPagedUsers(limit, offset);
    return res.status(200).send({ message: 'Usuarios enviados con éxito.', users });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Hubo un error obteniendo los usuarios');
  }
};


const getUserByEmailHandler = async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Buscando usuario con email:', email);

    let page = 1;
    const limit = 100;
    let userData = null;

    while (!userData && page <= 50) {
      const users = await db.getPagedUsers(limit, (page - 1) * limit);

      if (!users || users.length === 0) {
        break;
      }


      userData = users.find(user => user.email === email);

      if (userData) {
        console.log('Usuario encontrado en página', page);
        return res.status(200).json({
          message: 'Usuario encontrado con éxito',
          user: userData
        });
      }

      page++;
    }

    console.log('Usuario no encontrado con email:', email);
    return res.status(404).json({
      message: 'Usuario no encontrado'
    });

  } catch (err) {
    console.log('Error en getUserByEmailHandler:', err);
    return res.status(400).json({
      message: 'Error obteniendo el usuario',
      error: err.message
    });
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

export default {
  deleteUserHandler,
  changeRoleHandler,
  adminCreateUserHandler,
  getPagedUsersHandler,
  getUserByEmailHandler,
  getCategoriesHandler,
  getSubCategoriesHandler
};
