import bcrypt from 'bcrypt';
import db from '../database/usersAuth.js';
import generateToken from '../utils/generateToken.js';
import sendVerificationEmail from '../services/emailService.js';
import id from '../utils/uuid.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

//dotenv.config({path: './.env'});


const loginUser = async (req, res) => {
    try{
    const {email, password} = req.body;
    if(!password)
        return res.status(400).send('La contraseña es obligatoria');
    if(!email)
        return res.status(400).send('El correo electrónico es obligatorio');

    const user = await db.getUser(email);
    if(!user)
        return res.status(400).send('Usuario no encontrado');

    const dbPassword = user.password_hash; //Toca poner toda la lógica de la DB.
    const isMatch = await bcrypt.compare(password, dbPassword);
    
    if(isMatch)
        return res.status(200).send('Usuario loggeado con exito');
    else
        return res.status(400).send('Credenciales invalidas');
}
    catch(err){
        throw new Error(`Hubo un error ${err}`);
    }
};

const registerUser = async (req, res) => {
    try {
    const { password, name, programId, email } = req.body;

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const generatedId = id();

    const token = generateToken(email);

    await db.saveUser(generatedId, name, hash, programId, email);
    await sendVerificationEmail(email, token);
    
    res.status(201).send(`Usuario ${name} creado con éxito, por favor verifique su correo`);
}catch(err){
    throw new Error(`Hubo un error: ${err}`);
}

};

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
        res.status(400).send({error: 'Token invalido'});
    }
}

export default { registerUser, loginUser, verifyEmail };