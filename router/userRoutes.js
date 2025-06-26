import express from 'express';
import usersControllers from '../controllers/userControllers.js';

const router = express.Router();
       
router.post('/', usersControllers.registerUser);

export default router;
