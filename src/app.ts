import 'reflect-metadata';
import { container } from 'tsyringe';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import router from './infrastructure/adapters/primary/api/routes/router';
import { Request, Response } from 'express';
import { ErrorHandlerMiddleware } from './infrastructure/adapters/primary/api/middlewares/error-handling/error-handler.middleware';
import { ICacheMetricService } from './infrastructure/interfaces/cache-metric-service.interface';
import { TOKENS } from './infrastructure/di/di-tokens';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.use('/api', router);

app.get('/metrics', async (_req: Request, res: Response) => {
  const metricService = container.resolve<ICacheMetricService>(TOKENS.ICacheMetricService);
  res.set('Content-Type', 'text/plain');
  res.end(await metricService.getMetrics());
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

const errorHandler = container.resolve(ErrorHandlerMiddleware);
app.use(errorHandler.handle.bind(errorHandler));

export default app;
