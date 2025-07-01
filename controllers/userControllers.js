import bcrypt from 'bcrypt';
import db from '../models/interaction.js'

//Constante de prueba

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

const registerUser = (req, res) => {
    try {
    const { password, name } = req.body;
    const contraPrueba = undefined;
    console.log(name, password);

    const saltRounds = 10;

    const hashPassword = async () => {
        //Hashear la info
        const hash = await bcrypt.hash(password, saltRounds);
        console.log(hash);
        
        //poner lógica para guardar en db
        db.saveUser(name, hash);

    } 
    hashPassword();
    res.status(201).send(`Usuario ${name} creado con éxito`);
}catch(err){
    throw new Error(`Hubo un error: ${err}`);
}
    

};

export default { registerUser, loginUser };