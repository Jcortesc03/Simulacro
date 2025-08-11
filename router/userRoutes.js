import express from 'express';
import usersControllers from '../controllers/authControllers.js';

const router = express.Router();
       
router.post('/', usersControllers.registerUser);
router.get('/verify/:token', usersControllers.verifyEmail);
router.post('/login', usersControllers.loginUser);

export default router;