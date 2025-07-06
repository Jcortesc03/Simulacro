import bcrypt from 'bcrypt';
import db from '../database/usersAuth.js';
import generateToken from '../utils/generateToken.js';
import sendVerificationEmail from '../services/emailService.js';
import id from '../utils/uuid.js';
import jwt from 'jsonwebtoken';

const loginUser = async (req, res) => {
    try{
    const {name, password} = req.body;
    const user = await db.getUser(name);
    const dbPassword = user.password; //Toca poner toda la lógica de la DB.
    const isMatch = await bcrypt.compare(password, dbPassword);
    console.log(isMatch);
    
    
    
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

    const token = generateToken(id);

    await db.saveUser(id, name, hash, programId, email);
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
        const user = await db.getUser(decoded.id);

        if(!user)
            return res.status(400).send(`error: Usuario no existente`);
        if(user.verificated)
            return res.status(400).send(`Usuario ya verificado`);
        
        user.verificated = true;

    }
    catch(err){
        console.log(`Hubo un error ${err}`);
    }
}

export default { registerUser, loginUser };