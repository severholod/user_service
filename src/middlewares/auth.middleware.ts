import {NextFunction, Request, Response} from 'express';
import {ApiError, logger} from "../utils";
import {ITokenPayload} from "../types";

interface ITokenService {
	verifyToken(token: string): ITokenPayload;
}

export const authMiddleware = (TokenService: ITokenService) => (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw ApiError.unauthorized('No token provided');
		}
		const token = authHeader.split(' ')[1];
		req.user = TokenService.verifyToken(token)
		next();
	} catch (error) {
		logger.error('Auth middleware error: ', error);
		next(error);
	}
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.user || req.user.role !== 'admin') {
			throw ApiError.forbidden('Admin access required');
		}
		next();
	} catch (error) {
		logger.error('Admin middleware error: ', error);
		next(error);
	}
}

export const selfOrAdminMiddleware = (paramName = 'id') => (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.params[paramName];
		if (!req.user) {
			throw ApiError.unauthorized('Authentication required');
		}
		if (req.user.role !== 'admin' && req.user.userId !== userId) {
			throw ApiError.forbidden('Access denied');
		}
		next();
	} catch (error) {
		logger.error('Self or Admin middleware error: ', error);
		next(error);
	}
}