import {LoginDto, RegisterDto} from "../dto";

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'blocked';

export interface IUser {
	id: string;
	fullName: string;
	dateOfBirth: Date;
	email: string;
	password: string;
	role: UserRole;
	status: UserStatus;
	createdAt: Date;
}

export interface IUserCreate {
	fullName: string;
	dateOfBirth: Date;
	email: string;
	password: string;
	role: UserRole;
}

export interface IUserUpdate {
	fullName?: string;
	dateOfBirth?: Date;
	password?: string;
	status?: UserStatus;
}

export interface ITokenPayload {
	userId: string;
	role: UserRole;
	email: string;
}
export interface IAuthResponse {
	token: string;
	user: Pick<IUser, 'id'|'email'|'fullName'|'role'|'status' | 'dateOfBirth'>;
}

declare global {
	namespace Express {
		interface Request {
			user?: ITokenPayload;
		}
	}
	namespace NodeJS {
		interface ProcessEnv {
			JWT_EXPIRES_IN?: `${number} days`;
		}
	}
}

export interface IUserStorage {
	create(userData: IUserCreate): Promise<IUser>;
	findByEmail(email: string): Promise<IUser | null>;
	findById(id: string): Promise<IUser | null>;
	findAll(): Promise<IUser[]>;
	update(id: string, userData: IUserUpdate): Promise<IUser>;
}

export interface IAuthService {
	register(regDto: RegisterDto): Promise<IAuthResponse>;
	login(loginDto: LoginDto): Promise<IAuthResponse>;
}
export interface IUserService {
	getAllUsers(): Promise<IUser[]>;
	getUserById(id: string): Promise<IUser>;
	toggleBlockUser(id: string): Promise<IUser>;
}