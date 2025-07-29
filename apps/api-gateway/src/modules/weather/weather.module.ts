import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherServiceClientModule } from './weather-client/weather-client.module';

@Module({
  imports: [WeatherServiceClientModule],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
