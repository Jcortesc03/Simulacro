import express from 'express';
import AIControllers from '../controllers/AIControllers.js';
import verified from '../middlewares/verifyToken.js';
import { verifyTeacher, verifyAdmin } from '../middlewares/verifyRole.js';

const router = express.Router();

router.post('/generateQuestion',verified, verifyTeacher,  AIControllers.generateQuestionHandler);
router.get('/evaluateQuestion', verified, AIControllers.evaluateQuestionHandler);
router.get('/getRetroalimentation', verified, AIControllers.testRetroAlimentationHandler);

export default router;