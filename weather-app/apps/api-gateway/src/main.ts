import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';
import setupApp from './common/utils/setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GrpcExceptionFilter());
  setupApp(app);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>('port');

  await app.listen(port);
  Logger.log(`[API-GATEWAY] started on http://localhost:${port}`);
}

void bootstrap();
