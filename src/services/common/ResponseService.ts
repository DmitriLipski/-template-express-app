import { Service } from 'typedi';
import { HandleRequestResultType, HttpStatusCode } from '../../types';

@Service()
class ResponseService {
	makeHttpError(error: unknown): HandleRequestResultType {
		const statusCode = getStatusCode(error);
		const errorMessage = getErrorMessage(error);
		return { statusCode, errorMessage };
	}

	makeHttpOKResponse<T>(data: T): HandleRequestResultType<T> {
		return {
			headers: {
				'Content-Type': 'application/json',
			},
			statusCode: HttpStatusCode.OK,
			data,
		};
	}
}

export const getStatusCode = (error: unknown): HttpStatusCode => {
	if (error instanceof UniqueConstraintError) return HttpStatusCode.CONFLICT;
	if (
		error instanceof InvalidPropertyError ||
		error instanceof RequiredParameterError
	)
		return HttpStatusCode.BAD_REQUEST;
	if (error instanceof NotFoundElementError) return HttpStatusCode.NOT_FOUND;
	if (error instanceof MethodNotAllowedError)
		return HttpStatusCode.METHOD_NOT_ALLOWED;
	return HttpStatusCode.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = (error: unknown): string => {
	if (error instanceof UniqueConstraintError) return error.message;
	if (
		error instanceof InvalidPropertyError ||
		error instanceof RequiredParameterError
	)
		return error.message;
	if (error instanceof NotFoundElementError) return error.message;
	if (error instanceof MethodNotAllowedError) return error.message;
	return 'Internal Server Error';
};

export function requiredParam(param: string): void {
	throw new RequiredParameterError(param);
}

export class UniqueConstraintError extends Error {
	constructor(msg: string) {
		super(msg);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UniqueConstraintError);
		}
	}
}

export class InvalidPropertyError extends Error {
	constructor(msg: string) {
		super(msg);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidPropertyError);
		}
	}
}

export class RequiredParameterError extends Error {
	constructor(param: string) {
		super(`${param} can not be null or undefined.`);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, RequiredParameterError);
		}
	}
}

export class NotFoundElementError extends Error {
	constructor(elementId: number) {
		super(`Element with id: ${elementId} not found.`);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, RequiredParameterError);
		}
	}
}

export class MethodNotAllowedError extends Error {
	constructor(msg: string) {
		super(msg);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UniqueConstraintError);
		}
	}
}

export { ResponseService };
