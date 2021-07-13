import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { Service } from 'typedi';

import {
	UserService,
	LoggerService,
	ResponseService,
	InvalidPropertyError,
	MethodNotAllowedError,
} from '../services';
import { User } from '../models/User';

import { HandleRequestResultType, HttpMethods } from '../types';

type HttpRequestType<T> = {
	path: string;
	method: string;
	pathParams: Record<string, string | number>;
	queryParams: any;
	body?: T;
};

@Service()
class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly logger: LoggerService,
		private readonly responseService: ResponseService,
	) {}

	adaptRequest(_req: Request): HttpRequestType<User> {
		return {
			path: _req.path,
			method: _req.method,
			pathParams: _req.params,
			queryParams: _req.query,
			body: _req.body,
		};
	}

	async handleUserRequests(_req: Request, res: Response): Promise<Response> {
		const httpRequest = this.adaptRequest(_req);

		return this.handleRequest(httpRequest)
			.then(({ headers, statusCode, data, errorMessage }) => {
				return res
					.set(headers)
					.status(statusCode)
					.send(errorMessage ? { error: errorMessage } : data);
			})
			.catch((error: Error) => {
				this.logger.logToConsole(error.message);
				return res.status(500).json({ message: 'Internal Server Error' });
			});
	}

	async handleRequest(
		httpRequest: HttpRequestType<User>,
	): Promise<HandleRequestResultType<User[] | User | unknown>> {
		switch (httpRequest.method) {
			case HttpMethods.GET:
				return this.getAllUsers();
			case HttpMethods.POST:
				return this.addUser(httpRequest);
			default:
				return this.responseService.makeHttpError(
					new MethodNotAllowedError(
						`${httpRequest.method} method not allowed.`,
					),
				);
		}
	}

	async getAllUsers(): Promise<HandleRequestResultType<User[] | unknown>> {
		try {
			const result = (await this.userService.getAllUsers()) as User[];
			return this.responseService.makeHttpOKResponse<User[]>(result);
		} catch (error: unknown) {
			return this.responseService.makeHttpError(error);
		}
	}

	async addUser(
		httpRequest: HttpRequestType<User>,
	): Promise<HandleRequestResultType<User | unknown>> {
		if (!httpRequest.body) {
			return this.responseService.makeHttpError(
				new InvalidPropertyError('Bad request. No POST body.'),
			);
		}

		const { name, email, password } = httpRequest.body;

		const id = randomBytes(8).toString('hex');

		try {
			const user = { id, name, email, password };
			const result = await this.userService.addUser(user);

			return this.responseService.makeHttpOKResponse<User>(result);
		} catch (error: unknown) {
			return this.responseService.makeHttpError(error);
		}
	}
}

export { UserController };
