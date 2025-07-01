import bcrypt from 'bcrypt';
import db from '../models/interaction.js'

//Constante de prueba

const loginUser = () => {
    const {name, password} = req.body;
    const dbPassword = undefined; //Toca poner toda la lógica de la DB.
    const user = db.getUser(name);
    const isMatch = bcrypt.compare(password, dbPassword);
}

const registerUser = (req, res) => {
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

}

export default { registerUser };