import express from 'express';
import usersControllers from '../controllers/authControllers.js';
import verified from '../middlewares/verifyToken.js';
import { verifyAdmin, verifyTeacher } from '../middlewares/verifyRole.js';

const router = express.Router();

router.post('/register', usersControllers.registerUser);
router.get('/verify/:token', usersControllers.verifyEmail);
router.post('/login', usersControllers.loginUser);
router.get('/getSubjects', usersControllers.getSubjects);
router.patch('changePassword/', verified, usersControllers.changePasswordHandler);

export default router;
