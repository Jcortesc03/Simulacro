import express from 'express';
import { saveQuestionHandler, getLastQuestionsHandler } from '../controllers/questionControllers.js';
import verified from '../middlewares/verifyToken.js';
import { verifyAdmin, verifyTeacher } from '../middlewares/verifyRole.js'

const router = express.Router();

router.post('/saveQuestion', verified, verifyAdmin, saveQuestionHandler);
router.get('/getQuestions', verified, getLastQuestionsHandler);

export default router;
