import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:6600',
      package: 'notification',
      protoPath: 'libs/proto/notification.proto',
    },
  });
  await app.listen();
}
bootstrap();
