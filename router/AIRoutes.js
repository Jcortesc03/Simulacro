import express from 'express';
import AIControllers from '../controllers/AIControllers.js';
import verified from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/generateQuestion',verified, AIControllers.generateQuestionHandler);
router.get('/evaluateQuestion', verified, AIControllers.evaluateQuestionHandler);



export default router;