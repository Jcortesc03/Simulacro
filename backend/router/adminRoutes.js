import express from 'express';
import adminControllers from '../controllers/adminControllers.js';
import verified from '../middlewares/verifyToken.js'
import { verifyAdmin } from '../middlewares/verifyRole.js';

const router = express.Router();

router.delete('/deleteUser', verified, verifyAdmin, adminControllers.deleteUserHandler);
router.patch('/changeRole', verified, verifyAdmin, adminControllers.changeRoleHandler);
router.post('/adminRegister', verified, verifyAdmin, adminControllers.adminCreateUserHandler);
router.get('/getPagedUsers', verified, verifyAdmin, adminControllers.getPagedUsersHandler);
router.get('/getUserByEmail/:email', verified, verifyAdmin, adminControllers.getUserByEmailHandler);
router.get('/getCategories', verified, verifyAdmin, adminControllers.getCategoriesHandler);

export default router;
