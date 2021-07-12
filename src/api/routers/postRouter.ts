import express, { Request, Response } from 'express';
import Container from 'typedi';
import { PostController } from '../../controllers/PostController';
const router = express.Router();
const postController = Container.get(PostController);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/posts', (req: Request, res: Response) => {
	return postController.handlePostRequests(req, res);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/posts', (req: Request, res: Response) => {
	return postController.handlePostRequests(req, res);
});

export { router as postRouter };
