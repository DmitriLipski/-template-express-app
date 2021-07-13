import express, { Request, Response } from 'express';
import Container from 'typedi';
import { UserController } from '../../controllers/UserController';
const router = express.Router();
const userController = Container.get(UserController);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/posts', (req: Request, res: Response) => {
	return userController.handleUserRequests(req, res);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/posts', (req: Request, res: Response) => {
	return userController.handleUserRequests(req, res);
});

export { router as userRouter };
