import express from 'express';
import dotenv from 'dotenv';
import userRouter from './router/userRoutes.js';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || 2000
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', userRouter);

app.listen(port, () => {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});

