import express from 'express';
import usersControllers from '../controllers/userControllers.js';

const router = express.Router();
       
router.post('/', usersControllers.registerUser);
router.get('/', usersControllers.loginUser);

export default router;
