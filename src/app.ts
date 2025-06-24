import 'reflect-metadata';
import { container } from 'tsyringe';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import router from './routes/router';
import { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.json';
import { ErrorHandlerMiddleware } from './middlewares/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', router);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

const errorHandler = container.resolve(ErrorHandlerMiddleware);
app.use(errorHandler.handle.bind(errorHandler));

export default app;
