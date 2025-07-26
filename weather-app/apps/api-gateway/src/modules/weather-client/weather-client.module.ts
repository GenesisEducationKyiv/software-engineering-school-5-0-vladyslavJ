import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WeatherServiceClient } from './weather-client.service';
import { WeatherServiceClientDiTokens } from '../../../../../libs/common/di/weather-di-tokens';
import { PackageNames } from '../../common/utils/enums/package-names.enum';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PackageNames.WEATHER_PACKAGE,
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.get('weather.host')}:${config.get('weather.port')}`,
            package: 'weather',
            protoPath: 'libs/proto/weather.proto',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: WeatherServiceClientDiTokens.WEATHER_SERVICE_GRPC_CLIENT,
      useClass: WeatherServiceClient,
    },
  ],
  exports: [WeatherServiceClientDiTokens.WEATHER_SERVICE_GRPC_CLIENT],
})
export class WeatherServiceClientModule {}
