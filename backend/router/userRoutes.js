import express from "express";
import {
  loginUser,
  registerUser,
  verifyEmail,
  changePasswordHandler,
  getProfile,
} from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify/:token", verifyEmail);
router.patch("/changePassword", authMiddleware, changePasswordHandler);
router.get("/profile", authMiddleware, getProfile);

export default router;
