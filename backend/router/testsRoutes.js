import express from "express";
import {
  saveSimulationAttemptHandler,
  saveSimulationHandler,
  saveSimulationQuestionsHandler,
  getTestsByUserHandler,
  getSimulationAttemptsHandler,
  getStudentTestsHandler,
  getAttemptDetailsHandler
} from "../controllers/testsController.js";
import authMiddleware from '../middlewares/authMiddleware.js'; // <- CAMBIO AQUÍ
import { verifyAdmin, verifyTeacher } from "../middlewares/verifyRole.js";

const router = express.Router();

router.post('/saveSimulation', authMiddleware, verifyTeacher, saveSimulationHandler); // <- CAMBIO AQUÍ
router.post('/saveSimulationAttempt', authMiddleware, saveSimulationAttemptHandler); // <- CAMBIO AQUÍ
router.post('/saveSimulationQuestion', authMiddleware, verifyAdmin, saveSimulationQuestionsHandler); // <- CAMBIO AQUÍ
router.post('/getSimulations', authMiddleware, getTestsByUserHandler); // <- CAMBIO AQUÍ
router.get('/allSimulations', getSimulationAttemptsHandler); // <- Esta no necesita autenticación, se mantiene igual
router.get('/student-history', authMiddleware, getStudentTestsHandler); // <- CAMBIO AQUÍ
router.get('/attempt-details/:id', authMiddleware, getAttemptDetailsHandler); // <- CAMBIO AQUÍ

export default router;