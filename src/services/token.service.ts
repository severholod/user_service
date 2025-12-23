import jwt from 'jsonwebtoken';
import {ITokenPayload} from "../types";
import {ApiError} from "../utils";

export class TokenService {
	private static readonly secret = process.env.JWT_SECRET || 'default_secret';
	private static readonly expiresIn = process.env.JWT_EXPIRES_IN || '7 days';

	static generateToken(payload: ITokenPayload): string {
		return jwt.sign(payload, this.secret, {expiresIn: this.expiresIn});
	}

	static verifyToken(token: string): ITokenPayload {
		try {
			return jwt.verify(token, this.secret) as ITokenPayload;
		} catch (error) {
			throw ApiError.unauthorized('Invalid or expired token');
		}
	}
}