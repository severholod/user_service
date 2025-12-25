import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import {logger} from "../utils";

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
	dialect: 'postgres',
	logging: isDev ? console.log : false,
	dialectOptions: {
		ssl: isProd ? {
			require: true,
			rejectUnauthorized: false
		} : false
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
})

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		logger.success('Connection to the database has been established successfully.');

		if (isDev) {
			await sequelize.sync({ alter: true });
			logger.success('All models were synchronized successfully.');
		}
	} catch (error) {
		logger.error('Unable to connect to the database:', error);
		process.exit(1)
	}
}

export const disconnectFromDatabase = async () => {
	try {
		await sequelize.close();
		logger.info('Database connection closed.');
	} catch (error) {
		logger.error('Error closing database connection:', error);
	}
};

export default sequelize;