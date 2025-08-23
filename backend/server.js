import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './router/userRoutes.js';
import AIRouter from './router/AIRoutes.js';
import adminRouter from './router/adminRoutes.js'
import questionRouter from './router/questionRoutes.js'
import testsRouter from './router/testsRoutes.js'
import rateLimiter from './middlewares/rateLimiter.js'

dotenv.config();


const port = process.env.PORT || 2000
const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.set('trust proxy', 1); //Para probar con ngrok

app.use('/auth', userRouter);
app.use('/AI', AIRouter);
app.use('/questions', questionRouter);
app.use('/tests', testsRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
  const url = process.env.NGROOK_DOMAIN
    ? process.env.NGROOK_DOMAIN
    : `http://localhost:${port}`;

  console.log(`🚀 Servidor corriendo en: ${url}`);
});
