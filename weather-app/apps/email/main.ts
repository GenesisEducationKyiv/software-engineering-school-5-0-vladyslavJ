import { NestFactory } from '@nestjs/core';
import { EmailModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EmailModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:4650',
      package: 'email',
      protoPath: 'libs/proto/email.proto',
    },
  });
  await app.listen();
}
bootstrap();
