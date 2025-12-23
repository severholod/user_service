import {ApiError} from "./apiError";

export class Validators {
	static validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	static validatePassword(password: string): boolean {
		return password.length >= 6;
	}

	static validateDateOfBirth(date: Date): boolean {
		const birthDate = new Date(date);
		const today = new Date();
		const minDate = new Date();
		minDate.setFullYear(today.getFullYear() - 120);

		return birthDate <= today && birthDate >= minDate;
	}

	static validateFullName(fullName: string): boolean {
		return fullName.trim().length >= 2 && fullName.trim().length <= 100;
	}

	static validateUserCreate(data: any): void {
		if (!data.fullName || !Validators.validateFullName(data.fullName)) {
			throw ApiError.badRequest('Invalid full name');
		}

		if (!data.dateOfBirth || !Validators.validateDateOfBirth(new Date(data.dateOfBirth))) {
			throw ApiError.badRequest('Invalid date of birth');
		}

		if (!data.email || !Validators.validateEmail(data.email)) {
			throw ApiError.badRequest('Invalid email');
		}

		if (!data.password || !Validators.validatePassword(data.password)) {
			throw ApiError.badRequest('Password must be at least 6 characters');
		}
	}
}