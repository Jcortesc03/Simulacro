import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({path: './.env'});

const generateToken = (email, name, role) => {
    return jwt.sign({ email, name,  role }, process.env.JWT_SECRET, { expiresIn: '1h'});
};

export default generateToken;