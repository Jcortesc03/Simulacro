import express from 'express';
import AIControllers from '../controllers/AIControllers.js';

const router = express.Router();

router.get('/getQuestion', AIControllers.generateQuestionHandler);

export default router;