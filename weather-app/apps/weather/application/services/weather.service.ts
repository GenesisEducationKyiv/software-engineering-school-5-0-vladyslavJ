import { Injectable } from '@nestjs/common';
import { Weather } from '../../domain/models/weather.model';
import { GetWeatherUseCase } from '../use-cases/get-weather.use-case';

@Injectable()
export class WeatherService {
  constructor(private readonly getWeatherUseCase: GetWeatherUseCase) {}

  async getWeather(city: string): Promise<Weather> {
    return this.getWeatherUseCase.getWeather(city);
  }
}
