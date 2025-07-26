import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WeatherServiceClientDiTokens } from '../../libs/common/di/weather-di-tokens';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: WeatherServiceClientDiTokens.WEATHER_SERVICE_GRPC_CLIENT,
        transport: Transport.GRPC,
        options: {
          url: 'weather:5000',
          package: 'weather',
          protoPath: join(__dirname, '../../../libs/proto/weather.proto'),
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class WeatherGrpcClientModule {}
