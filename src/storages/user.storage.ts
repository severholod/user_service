import {IUser, IUserCreate, IUserStorage} from "../types";
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
        return await this.userModel.findByPk(id);
    }
    async findAll(): Promise<IUser[]> {
        return await this.userModel.findAll({
            order: [['createdAt', 'DESC']],
	        attributes: { exclude: ['password'] }
        });
    }

}