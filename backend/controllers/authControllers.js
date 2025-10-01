import bcrypt from "bcrypt";
import db from "../database/usersAuth.js";
import generateToken from "../utils/generateToken.js";
import sendVerificationEmail from "../services/emailService.js";
import id from "../utils/uuid.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password) return res.status(400).send("La contraseña es obligatoria.");
    if (!email) return res.status(400).send("El e-mail es obligatorio.");

    const user = await db.getUser(email);
    if (!user) return res.status(400).send("Usuario no existente.");

    const dbPassword = user.password_hash;
    const isMatch = await bcrypt.compare(password, dbPassword);

    if (!user.verificated || user.verificated === 0) {
      return res.status(400).send("Usuario no está verificado");
    }

    if (isMatch) {
      // --- MODIFICACIONES AQUÍ ---
      const token = generateToken(user.user_id, user.email, user.user_name, user.role_id); // Genera el token

      // Establecer la cookie HttpOnly y Secure
      res.cookie('jwt', token, {
        httpOnly: true, // No accesible por JavaScript del lado del cliente
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'Lax', // Protección CSRF. 'Strict' es más seguro pero puede ser restrictivo. 'Lax' es un buen equilibrio.
        maxAge: 3600000, // 1 hora en milisegundos (coincide con expiresIn del token)
        path: '/', // La cookie es válida para toda la aplicación
      });

      return res.status(200).json({
        message: "Inicio de sesión exitoso",
        // Ya no enviamos el token en el body de la respuesta.
        // Podemos enviar datos del usuario no sensibles si el frontend los necesita.
        user: {
          id: user.user_id,
          email: user.email,
          name: user.user_name,
          role: user.role_id, // Puedes mapear el ID del rol a su nombre si prefieres.
        }
      });
      // --- FIN MODIFICACIONES ---

    }

    return res.status(400).send("Credenciales inválidas");
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Ocurrió un error: ${err.message}`);
  }
};

// --- FUNCIÓN DE LOGOUT AÑADIDA ---
// Es importante tener una ruta de logout para invalidar la cookie
export const logoutUser = (req, res) => {
  res.cookie('jwt', 'loggedout', { // Sobreescribe la cookie con un valor que no sea un token válido
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000), // Expira en 10 segundos
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'Lax',
    path: '/',
  });
  res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};


// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { password, name, programName, email } = req.body;

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const generatedId = id();
    const token = generateToken(generatedId, email, name, 1);

    await sendVerificationEmail(email, token);
    await db.saveUser(generatedId, name, hash, programName, email);

    res
      .status(201)
      .send(`Usuario ${name} creado con éxito, por favor verifique su correo`);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Hubo un error");
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.getUser(decoded.email);

    if (!user) return res.status(400).send(`error: Usuario no existente`);
    if (user.verificated) return res.status(400).send(`Usuario ya verificado`);

    await db.verifyUser(decoded.email);
    res.status(200).send("Usuario autenticado con éxito");
  } catch (err) {
    if (err === "TokenExpiredError")
      return res.status(400).send("El token ha expirado");
    console.log(err);
    return res.status(400).send({ error: "Token invalido" });
  }
};

// CHANGE PASSWORD
export const changePasswordHandler = async (req, res) => {
  try {
    const { newPassword } = req.body;
    // req.user.id viene del middleware actualizado que decodifica el token de la cookie
    const userId = req.user.user_id; // Asegúrate de que el JWT tenga 'user_id'

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .send("La contraseña debe tener al menos 6 caracteres");
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(newPassword, saltRounds);

    await db.changePassword(userId, hash);

    return res.status(200).send("Contraseña actualizada con éxito");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Hubo un error cambiando la contraseña");
  }
};

// GET SUBJECTS
export const getSubjects = async (req, res) => {
  try {
    const subjects = await db.getSubjects();
    return res.status(200).send(subjects);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Hubo un error obteniendo las materias");
  }
};

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    // req.user ya contendrá los datos decodificados del token de la cookie
    res.json({
      name: req.user.name,
      email: req.user.email,
      role: req.user.role, // Esto será el ID del rol, puedes mapearlo a nombre si es necesario
    });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo perfil" });
  }
};

