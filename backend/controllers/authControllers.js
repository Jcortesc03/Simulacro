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
      return res.status(200).send({
        message: "Usuario verificado con éxito",
        token: generateToken(user.user_id, user.email, user.user_name, user.role_id),
      });
    }

    return res.status(400).send("Credenciales inválidas");
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Ocurrió un error: ${err.message}`);
  }
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
    const userId = req.user.id; // viene del middleware

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
    res.json({
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo perfil" });
  }
};
