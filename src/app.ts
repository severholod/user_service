import dotenv from "dotenv";
import express, {Response, Request} from "express";
import helmet from "helmet";
import cors from 'cors';
import {connectToDatabase, disconnectFromDatabase} from "./config/database";
import {ApiError, logger} from "./utils/";
import {AuthController, UserController} from "./controllers";
import {AuthService, UserService} from "./services";
import {UserStorage} from "./storages";
import {validateLogin, validateRegister} from "./middlewares";
import {adminMiddleware, authMiddleware, selfOrAdminMiddleware} from "./middlewares/auth.middleware";
import {TokenService} from "./services/token.service";
import {Server} from "node:http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const isDev = process.env.NODE_ENV === 'development';
let server: Server

const userStorage = new UserStorage()
const authController = new AuthController(new AuthService(userStorage))
const userController = new UserController(new UserService(userStorage))

app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
	logger.info(`${req.method} ${req.path}`);
	next();
})

// Health check endpoint
app.get('/health', (_, res) => {
	res.status(200).json({ status: 'OK', timestamp: new Date(), service: 'User Service' });
})

// Auth routes
app.post('/api/auth/login', validateLogin, authController.login);
app.post('/api/auth/register', validateRegister, authController.register);

// User routes
app.get('/api/users', authMiddleware(TokenService), adminMiddleware, userController.getAllUsers);
app.get('/api/users/:id', authMiddleware(TokenService), selfOrAdminMiddleware(), userController.getUserById);
app.post('/api/users/:id/toggle-block', authMiddleware(TokenService), selfOrAdminMiddleware(), userController.toggleBlockUser);

// 404
app.use((req, res) => {
	res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found`, success: false });
});

app.use((err: any, _: Request, res: Response) => {
	const stack = isDev ? { stack: err.stack } : {};

	if (err instanceof ApiError) {
		return res.status(err.statusCode).json({ message: err.message, success: false, ...stack });
	}

	logger.error('Unexpected error: ', err);
	res.status(500).json({ message: 'Internal Server Error', success: false, ...stack });
});

const gracefulShutdown = async (signal: string) => {
	logger.warn(`Received ${signal}. Starting graceful shutdown...`);

	try {
		if (server) {
			await new Promise<void>((resolve, reject) => {
				server.close((err) => {
					if (err) {
						logger.error('Error closing server:', err);
						reject(err);
					} else {
						logger.info('Server closed successfully');
						resolve();
					}
				});

				setTimeout(() => {
					logger.warn('Forcing server close after timeout');
					resolve();
				}, 5000);
			});
		}

		// Close database connection
		await disconnectFromDatabase();

		logger.success('Graceful shutdown completed');
		process.exit(0);
	} catch (error) {
		logger.error('Error during graceful shutdown:', error);
		process.exit(1);
	}
};

const setupSignalHandlers = () => {
	process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
	process.on('SIGINT', () => gracefulShutdown('SIGINT'));

	process.on('uncaughtException', (error) => {
		logger.error('Uncaught Exception:', error);
		gracefulShutdown('uncaughtException').catch(() => {
			process.exit(1);
		});
	});

	process.on('unhandledRejection', (reason, promise) => {
		logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
		gracefulShutdown('unhandledRejection').catch(() => {
			process.exit(1);
		});
	});

	logger.info('Signal handlers configured');
};

const startServer = async () => {
	try {
		await connectToDatabase();
		server = app.listen(PORT, () => {
			logger.success(`Server is running on port ${PORT}`);
			logger.success(`Environment: ${process.env.NODE_ENV}`);
		});
		setupSignalHandlers()

		server.on('error', (error: Error) => {
			logger.error('Server error', error)
			gracefulShutdown('server_error').catch(() => {
				process.exit(1)
			})
		})
	} catch (error) {
		logger.error('Failed to start server: ', error);
		process.exit(1)
	}
}

process.on('exit', (code) => {
	logger.info(`Process exiting with code: ${code}`);
});

startServer();

export default app;