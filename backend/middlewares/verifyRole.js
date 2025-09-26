import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const verifyAdmin = (req, res, next) => {
    // --- MODIFICACIONES AQUÍ: Leer el token de la cookie ---
    const token = req.cookies.jwt;

    if(!token)
        return res.status(403).json({error: 'Token requerido'}); // Usar .json() para consistencia

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return res.status(401).json({error: 'Token inválido o expirado'})

        req.user = decoded;
        // Tu generateToken usa 'role', no 'role_id' directamente en el payload.
        // Asegúrate de que 'decoded.role' sea el ID del rol.
        const userRole = parseInt(decoded.role, 10);

        // 2. Comparamos si el rol es exactamente 3 (Administrador)
        if (userRole === 3) {
            // Si el rol es correcto, el acceso es permitido
            next();
        } else {
            // Si no es 3, denegamos el acceso
            return res.status(403).json({error: 'Acceso denegado. Se requiere rol de Administrador.'});
        }
    });
};

const verifyTeacher = (req, res, next) => {
    // --- MODIFICACIONES AQUÍ: Leer el token de la cookie ---
    const token = req.cookies.jwt;

    if(!token)
        return res.status(403).json({error: 'Token requerido'});

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err)
            return res.status(401).json({error: 'Token inválido o expirado'});

        req.user = decoded;

         // --- LÓGICA DE PERMISOS CORREGIDA Y SIMPLIFICADA ---
        
        // 1. Convertimos el rol a un número para asegurar la comparación
        const userRole = parseInt(decoded.role, 10);
        
        // 2. Creamos una lista de roles permitidos
        const allowedRoles = [2, 3]; // 2: Profesor, 3: Administrador

        // 3. Verificamos si el rol del usuario está en la lista de permitidos
        if (allowedRoles.includes(userRole)) {
            // Si está en la lista, el acceso es permitido
            next();
        } else {
            // Si no está en la lista, denegamos el acceso
            return res.status(403).json({error: 'No está autorizado para realizar esta acción'});
        }
    });
};


export { verifyAdmin, verifyTeacher };