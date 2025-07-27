import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherGrpcController } from './infrastructure/adapters/primary/entry-points/weather.grpc.controller';
import { WeatherService } from './application/services/weather.service';
import configuration from './infrastructure/config/configuration';
import { ProvidersModule } from './infrastructure/adapters/secondary/providers/providers.module';
import { CacheModule } from './infrastructure/adapters/secondary/cache/cache.module';
import { LoggerModule } from '../../libs/modules/logger/logger.module';
import { GetWeatherUseCase } from './application/use-cases/get-weather.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ProvidersModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [WeatherGrpcController],
  providers: [WeatherService, GetWeatherUseCase],
})
export class WeatherModule {}
