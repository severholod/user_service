import { Request, Response, NextFunction } from 'express';
import { Validators, ApiError } from '../utils';

export const validateRegister = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	try {
		const { fullName, dateOfBirth, email, password } = req.body;

		if (!fullName || !Validators.validateFullName(fullName)) {
			throw ApiError.badRequest('Full name must be between 2 and 100 characters');
		}

		if (!dateOfBirth || !Validators.validateDateOfBirth(new Date(dateOfBirth))) {
			throw ApiError.badRequest('Invalid date of birth');
		}

		if (!email || !Validators.validateEmail(email)) {
			throw ApiError.badRequest('Invalid email address');
		}

		if (!password || !Validators.validatePassword(password)) {
			throw ApiError.badRequest('Password must be at least 6 characters');
		}

		next();
	} catch (error) {
		next(error);
	}
};

export const validateLogin = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	try {
		const { email, password } = req.body;

		if (!email || !Validators.validateEmail(email)) {
			throw ApiError.badRequest('Invalid email address');
		}

		if (!password) {
			throw ApiError.badRequest('Password is required');
		}

		next();
	} catch (error) {
		next(error);
	}
};