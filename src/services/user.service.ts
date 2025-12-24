import {IUser, IUserService, IUserStorage} from "../types";
import {ApiError} from "../utils";

export class UserService implements IUserService {
	private userStorage: IUserStorage;

	constructor(userStorage: IUserStorage) {
		this.userStorage = userStorage;
	}

    async getAllUsers(): Promise<IUser[]> {
        return await this.userStorage.findAll();
    }
    async getUserById(id: string): Promise<IUser> {
        const user = await this.userStorage.findById(id);
		if (!user) {
			throw ApiError.notFound('User not found');
		}
		return user;
    }
    async toggleBlockUser(id: string): Promise<IUser> {
	    const user = await this.userStorage.findById(id);
	    if (!user) {
		    throw ApiError.notFound('User not found');
	    }
		const newStatus = user.status === 'active' ? 'blocked' : 'active';
	    return await this.userStorage.update(id, {status: newStatus});
    }}