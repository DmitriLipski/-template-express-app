import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { Service } from 'typedi';

import {
	PostService,
	LoggerService,
	ResponseService,
	InvalidPropertyError,
	MethodNotAllowedError,
} from '../services';
import { Post } from '../models/Post';

import { HandleRequestResultType, HttpMethods } from '../types';

type HttpRequestType<T> = {
	path: string;
	method: string;
	pathParams: Record<string, string | number>;
	queryParams: any;
	body?: T;
};

@Service()
class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly logger: LoggerService,
		private readonly responseService: ResponseService,
	) {}

	adaptRequest(_req: Request): HttpRequestType<Post> {
		return {
			path: _req.path,
			method: _req.method,
			pathParams: _req.params,
			queryParams: _req.query,
			body: _req.body,
		};
	}

	async handlePostRequests(_req: Request, res: Response): Promise<Response> {
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
		httpRequest: HttpRequestType<Post>,
	): Promise<HandleRequestResultType<Post[] | Post | unknown>> {
		switch (httpRequest.method) {
			case HttpMethods.GET:
				return this.getAllPosts();
			case HttpMethods.POST:
				return this.addPost(httpRequest);
			default:
				return this.responseService.makeHttpError(
					new MethodNotAllowedError(
						`${httpRequest.method} method not allowed.`,
					),
				);
		}
	}

	async getAllPosts(): Promise<HandleRequestResultType<Post[] | unknown>> {
		try {
			const result = (await this.postService.getAllPosts()) as Post[];
			return this.responseService.makeHttpOKResponse<Post[]>(result);
		} catch (error: unknown) {
			return this.responseService.makeHttpError(error);
		}
	}

	async addPost(
		httpRequest: HttpRequestType<Post>,
	): Promise<HandleRequestResultType<Post | unknown>> {
		if (!httpRequest.body) {
			return this.responseService.makeHttpError(
				new InvalidPropertyError('Bad request. No POST body.'),
			);
		}

		const { title, description } = httpRequest.body;

		const id = randomBytes(8).toString('hex');

		try {
			const post = { id, title, description };
			const result = await this.postService.addPost(post);

			return this.responseService.makeHttpOKResponse<Post>(result);
		} catch (error: unknown) {
			return this.responseService.makeHttpError(error);
		}
	}
}

export { PostController };
