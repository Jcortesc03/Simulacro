import express from 'express';
import AIControllers from '../controllers/AIControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // <- CAMBIO AQUÍ
import { verifyTeacher, verifyAdmin } from '../middlewares/verifyRole.js';

const router = express.Router();

router.post('/generateQuestion', authMiddleware, verifyTeacher, AIControllers.generateQuestionHandler); // <- CAMBIO AQUÍ
router.get('/evaluateQuestion', authMiddleware, AIControllers.evaluateQuestionHandler); // <- CAMBIO AQUÍ
router.get('/getRetroalimentation', authMiddleware, AIControllers.testRetroAlimentationHandler); // <- CAMBIO AQUÍ

export default router;