import express from 'express';
import AIControllers from '../controllers/AIControllers.js';

const router = express.Router();

router.get('/generateQuestion', AIControllers.generateQuestionHandler);
router.get('/evaluateQuestion', AIControllers.evaluateQuestionHandler);

export default router;