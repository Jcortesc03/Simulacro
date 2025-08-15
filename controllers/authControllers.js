import bcrypt from 'bcrypt';
import db from '../database/usersAuth.js';
import generateToken from '../utils/generateToken.js';
import sendVerificationEmail from '../services/emailService.js';
import id from '../utils/uuid.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!password)
            return res.status(400).send('La contraseña es obligatoria.');
        if(!email)
            return res.status(400).send('El e-mail es obligatorio.');

        const user = await db.getUser(email);
        if(!user)
            return res.status(400).send('Usuario no existente.');

        const dbPassword = user.password_hash;
        const isMatch = await bcrypt.compare(password, dbPassword);
        
        if(!user.is_verified)
            return res.status(400).send('Usuario no está verificado');
        else if(isMatch){
            return res.status(200).send({
                message: `Usuario verificado con éxito`,
                token: generateToken(email, user.role_id)
            });
        }
        else
            return res.status(400).send('Invalid credencials');
}
    catch(err){
        if( err.name === 'TokenExpiredError'){
            
            const token = generateToken(email)
            await sendVerificationEmail(email, token);
            
            res.status(400).send('El token expiró, se envio un nuevo token');
        }
        throw new Error(`An error ocurred: ${err}`);
    }
};

const registerUser = async (req, res) => {
    try {
    const { password, name, programName, email } = req.body;

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const generatedId = id();

    const token = generateToken(email);

    await db.saveUser(generatedId, name, hash, programName, email);
    await sendVerificationEmail(email, token);
    
    res.status(201).send(`Usuario ${name} creado con éxito, por favor verifique su correo`);
}catch(err){
    console.log(err);
    return res.status(400).send('Hubo un error');
}

};

const adminCreateUserHandler = async (req, res) => {
    try{
        const { password, name, programName, email } = req.body;
        
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        
        const generatedId = id();
        
        const token = generateToken(email);
        
        await db.adminSaveUser(generatedId, name, hash, programName, email);
        
        res.status(201).send(`Usuario ${name} creado con éxito.`);
    }catch(err){
        console.log(err);
        return res.status(400).send('Hubo un error');
    }
}

const verifyEmail = async (req, res) => {
    const {token} = req.params;
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await db.getUser(decoded.email);

        if(!user)
            return res.status(400).send(`error: Usuario no existente`);
        if(user.verificated)
            return res.status(400).send(`Usuario ya verificado`);

        db.verifyUser(decoded.email);
        res.status(200).send('Usuario autenticado con éxito');
    }
    catch(err){
        if(err === 'TokenExpiredError')
            return res.status(400).send('El token ha expirado');
        console.log(err);
        return res.status(400).send({error: 'Token invalido'});
    }
}

const deleteUserHandler = async (req, res) =>{
    try{

        const { email } = req.body;
        db.deleteUser(email);

        return res.status(200).send('Usuario eliminado con éxito');
    }catch(err){
        console.log(err);
        return res.status(400).send('Hubo un error eliminando el usuario');
    }
} 

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
}

const changePasswordHandler = async (req, res) => {
    try{
        const { email, newPassword } = req.body;

        const saltRounds = 10;   
        const hash = await bcrypt.hash(newPassword, saltRounds);

        await db.changePassword(email, hash);

        return res.status(200).send('Contraseña actualizada con éxito');
    }catch(err){
        console.log(err);
        return res.status(400).send('Hubo un error cambiando la contraseña');
    }
}

const getSubjects = async (req, res) => {
    try{
        const subjects = await db.getSubjects();
        return res.status(200).send(subjects);
    }catch(err){
        console.log(err);
        return res.status(400).send('Hubo un error obteniendo las materias');
    };
};

export default { registerUser, loginUser, verifyEmail, adminCreateUserHandler, deleteUserHandler, changeRoleHandler, changePasswordHandler, getSubjects };
