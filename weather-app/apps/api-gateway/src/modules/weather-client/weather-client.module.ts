import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WeatherServiceClient } from './weather-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WEATHER_PACKAGE',
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
  providers: [WeatherServiceClient],
  exports: [WeatherServiceClient],
})
export class WeatherServiceClientModule {}
