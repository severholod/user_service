import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

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
		console.log('Connection to the database has been established successfully.');

		if (isDev) {
			await sequelize.sync({ alter: true });
			console.log('All models were synchronized successfully.');
		}
	} catch (error) {
		console.error('Unable to connect to the database:', error);
		process.exit(1)
	}
}

export default sequelize;