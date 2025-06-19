import express from 'express';
import usersControllers from '../controllers/userControllers.js';

const router = express.Router();
       
router.get('/', usersControllers.getUsers);

export default router;
