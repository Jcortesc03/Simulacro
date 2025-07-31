import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({path: './.env'});

const generateToken = (email, role) => {
    return jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1h'});
};

export default generateToken;