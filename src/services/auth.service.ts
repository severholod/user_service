import bcrypt from 'bcryptjs';
import {IAuthResponse, IUserCreate, IAuthService, IUserStorage} from "../types";
import {ApiError} from "../utils";
import {LoginDto, RegisterDto} from "../dto";
import {TokenService} from "./token.service";


export class AuthService implements IAuthService {
	private userStorage: IUserStorage;

	constructor(userStorage: IUserStorage) {
		this.userStorage = userStorage;
	}

	async register(regDto: RegisterDto): Promise<IAuthResponse> {
		const existingUser = await this.userStorage.findByEmail(regDto.email);
		if (existingUser) {
			throw ApiError.badRequest('Email is already in use');
		}
		const hashedPassword = await bcrypt.hash(regDto.password, 10);
		const userData: IUserCreate = {
			fullName: regDto.fullName,
			dateOfBirth: regDto.dateOfBirth,
			email: regDto.email,
			password: hashedPassword,
			role: 'user'
		};
		const {id, role, email, fullName, status, dateOfBirth} = await this.userStorage.create(userData);

		const token = TokenService.generateToken({
			userId: id,
			role,
			email
		});

		return {
			token,
			user: {
				id,
				email,
				fullName,
				role,
				status,
				dateOfBirth
			}
		}
	}

	async login(loginDto: LoginDto): Promise<IAuthResponse> {
		const {email, password} = loginDto;

		const user = await this.userStorage.findByEmail(email);
		if (!user) {
			throw ApiError.notFound('User not found');
		}
		if (user.status === 'blocked') {
			throw ApiError.forbidden('Account is blocked');
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw ApiError.badRequest('Invalid credentials');
		}

		const token = TokenService.generateToken({
			userId: user.id,
			role: user.role,
			email: user.email
		});

		return {
			token,
			user: {
				id: user.id,
				email: user.email,
				fullName: user.fullName,
				role: user.role,
				status: user.status,
				dateOfBirth: user.dateOfBirth
			}
		}
	}
}