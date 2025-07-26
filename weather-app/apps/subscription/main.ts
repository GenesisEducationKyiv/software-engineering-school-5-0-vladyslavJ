import { NestFactory } from '@nestjs/core';
import { SubscriptionModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(SubscriptionModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:4000',
      package: 'subscription',
      protoPath: 'libs/proto/subscription.proto',
    },
  });
  await app.listen();
}
bootstrap();
