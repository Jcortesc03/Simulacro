import express from "express";
import {
  loginUser,
  registerUser,
  verifyEmail,
  changePasswordHandler,
  getProfile,
  logoutUser, // Importar la nueva función de logout
} from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/login", authLimiter, loginUser); 
router.post("/register", authLimiter, registerUser);
router.get("/verify/:token", verifyEmail);
router.patch("/changePassword", authMiddleware, changePasswordHandler);
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", logoutUser); // Nueva ruta para cerrar sesión

export default router;