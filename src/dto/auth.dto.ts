export class LoginDto {
	constructor(
		public email: string,
		public password: string
	) {}

	static fromRequest(body: any): LoginDto {
		return new LoginDto(body.email, body.password);
	}
}

export class RegisterDto {
	constructor(
		public fullName: string,
		public dateOfBirth: Date,
		public email: string,
		public password: string
	) {}

	static fromRequest(body: any): RegisterDto {
		return new RegisterDto(
			body.fullName,
			new Date(body.dateOfBirth),
			body.email,
			body.password
		);
	}
}