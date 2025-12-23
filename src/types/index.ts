export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'blocked';

export interface IUser {
	id: string;
	fullName: string;
	dateOfBirth: Date;
	email: string;
	role: UserRole;
	status: UserStatus;
	createdAt: Date;
	updatedAt: Date;
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

export interface ILoginCredentials {
	email: string;
	password: string;
}

export interface ITokenPayload {
	userId: string;
	role: UserRole;
	email: string;
}
export interface IAuthResponse {
	token: string;
	user: Pick<IUser, 'id'|'email'|'fullName'|'role'|'status'>;
}

declare global {
	namespace Express {
		interface Request {
			user?: ITokenPayload;
		}
	}
}