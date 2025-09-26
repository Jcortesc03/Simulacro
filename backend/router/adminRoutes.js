import express from 'express';
import adminControllers from '../controllers/adminControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // <- CAMBIO AQUÍ
import { verifyAdmin } from '../middlewares/verifyRole.js';

const router = express.Router();

router.delete('/deleteUser', authMiddleware, verifyAdmin, adminControllers.deleteUserHandler); // <- CAMBIO AQUÍ
router.patch('/changeRole', authMiddleware, verifyAdmin, adminControllers.changeRoleHandler); // <- CAMBIO AQUÍ
router.post('/adminRegister', authMiddleware, verifyAdmin, adminControllers.adminCreateUserHandler); // <- CAMBIO AQUÍ
router.get('/getPagedUsers', authMiddleware, verifyAdmin, adminControllers.getPagedUsersHandler); // <- CAMBIO AQUÍ
router.get('/getUserByEmail/:email', authMiddleware, verifyAdmin, adminControllers.getUserByEmailHandler); // <- CAMBIO AQUÍ
router.get('/getCategories', authMiddleware, verifyAdmin, adminControllers.getCategoriesHandler); // <- CAMBIO AQUÍ
router.get('/subcategories', authMiddleware, adminControllers.getSubCategoriesHandler); // <- CAMBIO AQUÍ
router.get('/dashboard/stats', authMiddleware, verifyAdmin, adminControllers.getDashboardStatsHandler);

export default router;