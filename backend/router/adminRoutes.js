import express from 'express';
import adminControllers from '../controllers/adminControllers.js';
import verified from '../middlewares/verifyToken.js'
import { verifyAdmin } from '../middlewares/verifyRole.js';
import admin from '../database/admin.js';

const router = express.Router();

router.delete('/deleteUser', verified, verifyAdmin, adminControllers.deleteUserHandler);
router.patch('/modifyRole', verified, verifyAdmin, adminControllers.changeRoleHandler);
router.post('/adminRegister', verified, verifyAdmin, adminControllers.adminCreateUserHandler);
router.get('/getPagedUsers', verified, verifyAdmin, adminControllers.getPagedUsersHandler);

export default router;
