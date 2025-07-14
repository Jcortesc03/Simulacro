import express from 'express';
import { saveQuestionHandler, getLastQuestionsHandler } from '../controllers/questionControllers.js';

const router = express.Router();

router.post('/saveQuestion', saveQuestionHandler);
router.post('/getQuestions', getLastQuestionsHandler);

export default router;
