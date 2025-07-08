import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './router/userRoutes.js';
import AIRouter from './router/AIRoutes.js';

dotenv.config();

const port = process.env.PORT || 2000
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', userRouter);
app.use('/AI', AIRouter);

app.listen(port, () => {
    console.log(`Servidor corriendo en: ${process.env.NGROOK_DOMAIN}`); //o http://localhost:${port}
});