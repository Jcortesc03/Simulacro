import express from 'express';
import AIControllers from '../controllers/AIControllers.js';
import verified from '../middlewares/verifyToken.js';
import { verifyTeacher, verifyAdmin } from '../middlewares/verifyRole.js';

const router = express.Router();

router.get('/generateQuestion',verified, verifyTeacher,  AIControllers.generateQuestionHandler);
router.get('/evaluateQuestion', verified, AIControllers.evaluateQuestionHandler);



export default router;