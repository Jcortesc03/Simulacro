import express from 'express';
import {
  saveQuestionHandler,
  getLastQuestionsHandler,
  deleteQuestionHandler,
  updateQuestionHandler,
  getAllCategoriesQuestionsHandler
} from '../controllers/questionControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // <- CAMBIO AQUÍ
import { verifyAdmin, verifyTeacher } from '../middlewares/verifyRole.js';

const router = express.Router();

router.post('/saveQuestion', authMiddleware, verifyAdmin, saveQuestionHandler); // <- CAMBIO AQUÍ
router.post('/saveQuestion1', authMiddleware, verifyTeacher, saveQuestionHandler); // <- CAMBIO AQUÍ
router.get('/getQuestions', authMiddleware, getLastQuestionsHandler); // <- CAMBIO AQUÍ
router.get('/getGeneralQuestions', authMiddleware, getAllCategoriesQuestionsHandler); // <- CAMBIO AQUÍ
router.delete('/:id', authMiddleware, verifyAdmin, deleteQuestionHandler); // <- CAMBIO AQUÍ
router.put('/:id', authMiddleware, verifyAdmin, updateQuestionHandler); // <- CAMBIO AQUÍ

export default router;