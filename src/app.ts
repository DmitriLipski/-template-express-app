import express from 'express';
import { userRouter } from './api/routers/userRouter';

const app = express();
app.use(userRouter);

export default app;
