import express from 'express';
import verified from '../middlewares/verifyToken.js';
import adminControllers from '../controllers/adminControllers.js'; // ya tiene getCategoriesHandler

const router = express.Router();

router.get('/', verified, adminControllers.getCategoriesHandler);
router.get('/subcategories', verified, adminControllers.getSubCategoriesHandler);

export default router;
