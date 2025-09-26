import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const verifyToken = (req, res, next) => {
  // --- CAMBIO PRINCIPAL AQUÍ ---
  // 1. Ya no leemos de req.headers, leemos de las cookies.
  const token = req.cookies.jwt;

  // 2. Un solo 'if' es suficiente para saber si el token existe.
  if (!token) {
    return res.status(401).json({ error: "Token de sesión requerido" });
  }

  // 3. El resto de la lógica para verificar el token se mantiene igual.
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // (Opcional pero recomendado) Mejorar el mensaje de error
      if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: "Token de sesión expirado" });
      }
      return res.status(401).json({ error: "Token de sesión inválido" });
    }

    if (!decoded.user_id) {
      return res.status(400).json({ error: "El token no contiene user_id" });
    }

    req.user = decoded;
    next();
  });
};

export default verifyToken;