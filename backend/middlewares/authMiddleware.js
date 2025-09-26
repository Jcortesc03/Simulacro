import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  // --- MODIFICACIONES AQUÍ: Leer el token de la cookie ---
  const token = req.cookies.jwt; // Requiere 'cookie-parser' en server.js

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado, token faltante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Asegúrate de que las propiedades del token decodificado coincidan con lo que esperas.
    // Tu generateToken usa: { user_id, email, name, role }
    req.user = {
      user_id: decoded.user_id, // Usar 'user_id' según tu generateToken
      id: decoded.user_id, // Mantener 'id' para compatibilidad con código existente si lo usa
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
    next();
  } catch (err) {
    // Es buena práctica diferenciar si es un token inválido o expirado.
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expirado" });
    }
    return res.status(401).json({ message: "Token inválido" });
  }
};

export default authMiddleware;