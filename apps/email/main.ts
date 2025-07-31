import { NestFactory } from '@nestjs/core';
import { EmailModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RABBITMQ_URL, DIGEST_QUEUE } from '../../libs/config/rabbitmq.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EmailModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:8888',
      package: 'email',
      protoPath: 'libs/proto/email.proto',
    },
  });

  const rabbitApp = await NestFactory.createMicroservice<MicroserviceOptions>(EmailModule, {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: DIGEST_QUEUE,
      queueOptions: { durable: true },
    },
  });

  await app.listen();
  await rabbitApp.listen();
}
bootstrap();
