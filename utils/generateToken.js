import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({path: './.env'});

const generateToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h'});
};

export default generateToken;