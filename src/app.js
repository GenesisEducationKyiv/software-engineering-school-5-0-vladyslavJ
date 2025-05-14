import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import router from './routes/routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api', router);

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

app.use(errorHandler);

export default app;
