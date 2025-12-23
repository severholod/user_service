import bcrypt from 'bcryptjs';
import {IAuthResponse, IUserCreate, IAuthService} from "../types";
import {ApiError, Validators} from "../utils";
import {LoginDto, RegisterDto} from "../dto";
import {TokenService} from "./token.service";


export class AuthService implements IAuthService {
	// TODO: userStorage
	private userStorage: any;

	constructor(userRepository: any) {
		this.userStorage = userRepository;
	}

	async register(regDto: RegisterDto): Promise<IAuthResponse> {
		Validators.validateUserCreate(regDto);

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
		const newUser = await this.userStorage.create(userData);

		const token = TokenService.generateToken({
			userId: newUser.id,
			role: newUser.role,
			email: newUser.email
		});

		return {
			token,
			user: newUser
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
			user
		}
	}
}