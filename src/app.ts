import dotenv from "dotenv";
import express, {NextFunction} from "express";
import helmet from "helmet";
import cors from 'cors';
import {connectToDatabase} from "./config/database";
import {ApiError, logger} from "./utils/";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const isDev = process.env.NODE_ENV === 'development';

// TODO: define controllers

app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.path}`);
	next();
})

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'OK', timestamp: new Date(), service: 'User Service' });
})

// Auth routes
app.post('/auth/login', async (req, res, next: NextFunction) => {});
app.post('/auth/register', async (req, res, next: NextFunction) => {});

// User routes
app.get('/api/users', async (req, res, next: NextFunction) => {});
app.get('/api/users/:id', async (req, res, next: NextFunction) => {});
app.patch('/api/users/:id', async (req, res, next: NextFunction) => {});
app.post('/api/users/:id/toggle-block', async (req, res, next: NextFunction) => {});

// 404
app.use('*', (req, res) => {
	res.status(404).json({ message: `Route ${req.originalUrl} not found`, success: false });
});

// TODO: Error handler
app.use((err: any, req: express.Request, res: express.Response, next: NextFunction) => {
	const stack = isDev ? { stack: err.stack } : {};

	if (err instanceof ApiError) {
		return res.status(err.statusCode).json({ message: err.message, success: false, ...stack });
	}

	logger.error('Unexpected error: ', err);
	res.status(500).json({ message: 'Internal Server Error', success: false, ...stack });
});

const startServer = async () => {
	try {
		await connectToDatabase();
		app.listen(PORT, () => {
			logger.success(`Server is running on port ${PORT}`);
			logger.success(`Environment: ${process.env.NODE_ENV}`);
		});
	} catch (error) {
		logger.error('Failed to start server: ', error);
		process.exit(1)
	}
}

startServer();

export default app;