import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import router from './routes/router';
import { errorHandler } from './middlewares/errorHandler';
import { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.json';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', router);

app.use((_req: Request, res: Response, _next: NextFunction) => {
	res.status(404).json({ message: 'Not Found' });
});

app.use(errorHandler);

export default app;
