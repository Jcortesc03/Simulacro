import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js'; // <- CAMBIO AQUÍ
import adminControllers from '../controllers/adminControllers.js';

const router = express.Router();

router.get('/', authMiddleware, adminControllers.getCategoriesHandler); // <- CAMBIO AQUÍ
router.get('/subcategories', authMiddleware, adminControllers.getSubCategoriesHandler); // <- CAMBIO AQUÍ

export default router;