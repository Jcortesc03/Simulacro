import bcrypt from 'bcrypt';

//Constante de prueba

const loginUser = () => {
    const {user, password} = req.body;
    const dbPassword = undefined; //Toca poner toda la lógica de la DB.
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
        
        //deshasheada de prueba
        const isMatch = await bcrypt.compare(password, hash);
        console.log(isMatch);
        
        //poner lógica para guardar en db


    } 
    hashPassword();

}

export default { registerUser };