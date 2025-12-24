import bcrypt from "bcryptjs";
import {IUser, IUserCreate, IUserStorage, IUserUpdate} from "../types";
import {ModelStatic} from "sequelize";
import {UserModel} from "../models";

export class UserStorage implements IUserStorage {
	private userModel: ModelStatic<UserModel>

	constructor() {
		this.userModel = UserModel
	}

    async create(userData: IUserCreate): Promise<IUser> {
        return await this.userModel.create(userData)
    }
    async findByEmail(email: string): Promise<IUser | null> {
        return await this.userModel.findOne({ where: { email } });
    }
    async findById(id: string): Promise<IUser | null> {
        return await this.userModel.findByPk(id, {
			attributes: { exclude: ['password'] }
        });
    }
    async findAll(): Promise<IUser[]> {
        return await this.userModel.findAll({
            order: [['createdAt', 'DESC']],
	        attributes: { exclude: ['password'] }
        });
    }
	async update(id: string, userData: IUserUpdate): Promise<IUser> {
		const user = await this.findById(id);
		if (!user) {
			throw new Error('User not found');
		}

		if (userData.password) {
			userData.password = await bcrypt.hash(userData.password, 10);
		}

		await this.userModel.update(userData, { where: { id } });
		return await this.findById(id) as IUser;
	}

}