import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import { UserRole, UserStatus} from "../types";
import sequelize from "../config/database";

export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
	declare id: CreationOptional<string>;
	declare fullName: string;
	declare dateOfBirth: Date;
	declare email: string;
	declare password: string;
	declare role: UserRole;
	declare status: CreationOptional<UserStatus>;
	declare readonly createdAt: CreationOptional<Date>;
}

UserModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		fullName: {
			type: DataTypes.STRING(120),
			allowNull: false
		},
		dateOfBirth: {
			type: DataTypes.DATEONLY,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			},
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM('admin', 'user'),
			allowNull: false,
			defaultValue: 'user'
		},
		status: {
			type: DataTypes.ENUM('active', 'blocked'),
			allowNull: false,
			defaultValue: 'active'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		}
	}, {
	sequelize,
	tableName: 'users',
	modelName: 'User',
	timestamps: true,
	indexes: [
		{ unique: true, fields: ['email'] },
		{ fields: ['role']},
		{ fields: ['status'] }
	]
})