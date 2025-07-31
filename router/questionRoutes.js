import express from 'express';
import { saveQuestionHandler, getLastQuestionsHandler } from '../controllers/questionControllers.js';
import verified from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/saveQuestion', verified, saveQuestionHandler);
router.post('/getQuestions', getLastQuestionsHandler);

export default router;
