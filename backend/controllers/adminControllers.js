import db from '../database/admin.js'
import bcrypt from 'bcrypt';
import id from '../utils/uuid.js';
import generateToken from '../utils/generateToken.js';

const deleteUserHandler = async (req, res) =>{
    try{
        const { email } = req.body;
        db.deleteUser(email);

        return res.status(200).send('Usuario eliminado con éxito');
    }catch(err){
        console.log(err);
        return res.status(400).send('Hubo un error eliminando el usuario');
    }
};

const changeRoleHandler = async (req, res) => {
    try{
        const { email, roleName } = req.body;      
        await db.changeRole(email, roleName);
        res.status(200).send('Usuario modificado con éxito');
    }
    catch(err){
        console.log(err);
        return res.status(400).send('Hubo un error cambiando el rol');
    }
};

const adminCreateUserHandler = async (req, res) => {
    try{
        const { password, name, programName, email } = req.body;
        
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        
        const generatedId = id();
        
        const token = generateToken(email, name, 1);
        
        await db.adminSaveUser(generatedId, name, hash, programName, email);
        
        res.status(201).send(`Usuario ${name} creado con éxito.`);
    }catch(err){
        console.log(err);
        return res.status(400).send('Hubo un error');
    };
};

const getPagedUsersHandler = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;   // si no mandan nada, arranca en página 1
        const limit = parseInt(req.query.limit) || 10; // si no mandan nada, trae 10 registros
        const offset = (page - 1) * limit;             // cálculo del offset

        const users = await db.getPagedUsers(limit, offset);
        return res.status(200).send({ message: 'Usuarios enviados con exito.', users });

    }catch{
        console.log(err);
        return res.status(400).send('Hubo un error');
    }
};

export default { deleteUserHandler, changeRoleHandler, adminCreateUserHandler, getPagedUsersHandler };