import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app.module';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';
import setupApp from './common/utils/setup-app';
import { LoggerDiTokens } from '../../../libs/modules/logger/di/di-tokens';
import { ILogger } from '../../../libs/modules/logger/interfaces/logger.interface';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GrpcExceptionFilter());
  setupApp(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>('port');

  await app.listen(port);
  const logger = app.get<ILogger>(LoggerDiTokens.LOGGER);
  logger.info(`[API-GATEWAY] started on http://localhost:${port}`);
}

void bootstrap();
