import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export default function setupApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(helmet());
}
