import { NestFactory } from '@nestjs/core';
import { EmailModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RABBITMQ_URL, DIGEST_QUEUE } from '../../libs/config/rabbitmq.config';

async function bootstrap() {
  const app = await NestFactory.create(EmailModule);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:8888',
        package: 'email',
        protoPath: 'libs/proto/email.proto',
      },
    },
    { inheritAppConfig: true },
  );

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: DIGEST_QUEUE,
        queueOptions: { durable: true },
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
}
bootstrap();
