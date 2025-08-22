import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(' ')[1];

    if(!token)
        res.status(403).send({error: 'Token requerido'});
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err) return res.status(401).send({error: 'Token invalido'})
        
    req.user = decoded;
    if(decoded.role !== '3')
        return res.status(403).send({error: 'No está autorizado'});    
    next();
    });
} 

const verifyTeacher = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(' ')[1];

    if(!token)
        res.status(403).send({error: 'Token requerido'});
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err)
            return res.status(401).send({error: 'Token invalido'});
        
        req.user = decoded; 

        if(decoded.role !== '2' && decoded.role !== '3')
            return res.status(403).send({error: 'No está autorizado'});
        next();
        });
} 

export { verifyAdmin, verifyTeacher };

