export class ApiError extends Error {
	constructor(
		public statusCode: number,
		public message: string,
		public isOperational = true,
		public stack = ''
	) {
		super(message);
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	static badRequest(message: string) {
		return new ApiError(400, message);
	}

	static unauthorized(message: string) {
		return new ApiError(401, message);
	}

	static forbidden(message: string) {
		return new ApiError(403, message);
	}

	static notFound(message: string) {
		return new ApiError(404, message);
	}

	static internal(message: string) {
		return new ApiError(500, message);
	}
}