import {IUserService} from "../types";
import {NextFunction, Request, Response} from "express";
import {ApiError, logger} from "../utils";

export class UserController {
	private userService: IUserService;

	constructor(userService: IUserService) {
		this.userService = userService;
	}

	getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const users = await this.userService.getAllUsers();

			res.status(200).json({
				success: true,
				data: users
			})
		} catch (error) {
			logger.error('Get users error: ', error);
			next(error);
		}
	}
	getUserById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.params.id;
			if (!userId) {
				throw ApiError.badRequest('User ID is required');
			}

			const user = await this.userService.getUserById(userId);

			res.status(200).json({
				success: true,
				data: user
			})
		} catch (error) {
			logger.error('Get user by ID error: ', error);
			next(error);
		}
	}
	toggleBlockUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.params.id;
			if (!userId) {
				throw ApiError.badRequest('User ID is required');
			}

			const updatedUser = await this.userService.toggleBlockUser(userId);
			const action = updatedUser.status === 'blocked' ? 'blocked' : 'unblocked';
			logger.info(`User ${action} successfully: `, updatedUser.email);

			res.status(200).json({
				success: true,
				data: updatedUser
			})
		} catch (error) {
			logger.error('Toggle block user error: ', error);
			next(error);
		}
	}
}