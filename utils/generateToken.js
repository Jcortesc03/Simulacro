import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({path: './.env'});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h'});
};

export default generateToken;