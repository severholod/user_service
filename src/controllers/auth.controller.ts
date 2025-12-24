import {Request, Response, NextFunction} from "express";
import {IAuthService} from "../types";
import {logger} from "../utils";
import {LoginDto, RegisterDto} from "../dto";

export class AuthController {
	private authService: IAuthService;

	constructor(authService: IAuthService) {
		this.authService = authService;
	}

	register = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const regDto = RegisterDto.fromRequest(req.body);
			const response = await this.authService.register(regDto);

			logger.success('User registered successfully: ', response.user.email);

			res.status(201).json({
				success: true,
				data: response
			})
		} catch (error) {
			logger.error('Registration error: ', error);
			next(error);
		}
	}
	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const loginDto = LoginDto.fromRequest(req.body);
			const response = await this.authService.login(loginDto);

			logger.success('User logged in successfully: ', response.user.email);

			res.status(200).json({
				success: true,
				data: response
			})
		} catch (error) {
			logger.error('Login error: ', error);
			next(error);
		}
	}
}