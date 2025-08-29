import express from 'express';
import { saveQuestionHandler, getLastQuestionsHandler, deleteQuestionHandler, updateQuestionHandler, getAllCategoriesQuestionsHandler } from '../controllers/questionControllers.js';
import verified from '../middlewares/verifyToken.js';
import { verifyAdmin, verifyTeacher } from '../middlewares/verifyRole.js'

const router = express.Router();

router.post('/saveQuestion', verified, verifyAdmin, saveQuestionHandler);
router.post('/saveQuestion1', verified, verifyTeacher, saveQuestionHandler);
router.get('/getQuestions', verified, getLastQuestionsHandler);
router.get('/getGeneralQuestions', verified, getAllCategoriesQuestionsHandler);
router.delete('/:id', verified, verifyAdmin, deleteQuestionHandler);
router.put('/:id', verified, verifyAdmin, updateQuestionHandler);

export default router;
