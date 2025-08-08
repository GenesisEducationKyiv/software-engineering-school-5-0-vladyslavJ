import { NestFactory } from '@nestjs/core';
import { WeatherModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(WeatherModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:5000',
      package: 'weather',
      protoPath: 'libs/proto/weather.proto',
    },
  });
  await app.listen();
}
bootstrap();
