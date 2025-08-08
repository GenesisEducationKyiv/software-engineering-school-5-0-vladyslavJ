import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WeatherServiceClient } from './weather-client.service';
import { WeatherServiceClientDiTokens } from '../../../../../../libs/common/di/weather-di-tokens';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { GRPC_PACKAGES } from '../../../../../../libs/common/constants/grpc-package.const';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GrpcClientDiTokens.WEATHER_SERVICE_GRPC_CLIENT,
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.get('weather.host')}:${config.get('weather.port')}`,
            package: GRPC_PACKAGES.WEATHER,
            protoPath: 'libs/proto/weather.proto',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: WeatherServiceClientDiTokens.WEATHER_SERVICE_CLIENT,
      useClass: WeatherServiceClient,
    },
  ],
  exports: [WeatherServiceClientDiTokens.WEATHER_SERVICE_CLIENT],
})
export class WeatherServiceClientModule {}
