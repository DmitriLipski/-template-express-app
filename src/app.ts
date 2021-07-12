import express from 'express';
import bodyParser from 'body-parser';
import { postRouter } from './api/routers/postRouter';

const app = express();
app.use(bodyParser.json());
app.use(postRouter);

export default app;
