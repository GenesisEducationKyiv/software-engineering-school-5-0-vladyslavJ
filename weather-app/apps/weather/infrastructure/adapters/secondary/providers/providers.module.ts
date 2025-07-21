import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherApiAdapter } from './weather-api.adapter';
import { OpenWeatherMapAdapter } from './open-weather-map.adapter';
import { WeatherApiMapper } from './mappers/weather-api.mapper';
import { OpenWeatherMapMapper } from './mappers/open-weather-map.mapper';
import { ProviderDiTokens } from './di/di-tokens';
import { LoggerModule } from '../../../../../../libs/modules/logger/logger.module';
import { HttpClientModule } from '../http-client/http-client.module';
import { ChainWeatherService } from './chain-weather.service';
import { ILogger } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';

@Module({
  imports: [LoggerModule, HttpClientModule],
  providers: [
    {
      provide: ProviderDiTokens.WEATHER_API_ADAPTER,
      useClass: WeatherApiAdapter,
    },
    {
      provide: ProviderDiTokens.WeatherApiMapper,
      useClass: WeatherApiMapper,
    },
    {
      provide: ProviderDiTokens.WeatherApiKey,
      useFactory: (configService: ConfigService) =>
        configService.get<string>('weather.weatherApiKey'),
      inject: [ConfigService],
    },
    {
      provide: ProviderDiTokens.WeatherBaseUrl,
      useFactory: (configService: ConfigService) =>
        configService.get<string>('weather.weatherBaseUrl'),
      inject: [ConfigService],
    },
    {
      provide: ProviderDiTokens.OPEN_WEATHER_MAP_ADAPTER,
      useClass: OpenWeatherMapAdapter,
    },
    {
      provide: ProviderDiTokens.OpenWeatherMapMapper,
      useClass: OpenWeatherMapMapper,
    },
    {
      provide: ProviderDiTokens.OpenWeatherMapApiKey,
      useFactory: (configService: ConfigService) =>
        configService.get<string>('weather.openWeatherMapApiKey'),
      inject: [ConfigService],
    },
    {
      provide: ProviderDiTokens.OpenWeatherMapBaseUrl,
      useFactory: (configService: ConfigService) =>
        configService.get<string>('weather.openWeatherMapBaseUrl'),
      inject: [ConfigService],
    },
    {
      provide: ProviderDiTokens.CHAIN_WEATHER_SERVICE,
      useFactory: (
        weatherApi: WeatherApiAdapter,
        openWeatherMap: OpenWeatherMapAdapter,
        logger: ILogger,
      ) => new ChainWeatherService([weatherApi, openWeatherMap], logger),
      inject: [
        ProviderDiTokens.WEATHER_API_ADAPTER,
        ProviderDiTokens.OPEN_WEATHER_MAP_ADAPTER,
        LoggerDiTokens.LOGGER,
      ],
    },
  ],
  exports: [
    ProviderDiTokens.WEATHER_API_ADAPTER,
    ProviderDiTokens.OPEN_WEATHER_MAP_ADAPTER,
    ProviderDiTokens.CHAIN_WEATHER_SERVICE,
  ],
})
export class ProvidersModule {}
