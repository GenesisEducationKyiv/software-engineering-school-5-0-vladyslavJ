import { Injectable } from '@nestjs/common';
import { Weather } from '../../../../libs/common/models/weather.model';
import { GetWeatherUseCase } from '../use-cases/get-weather.use-case';
import { IWeatherInputPort } from '../ports/weather.port';

@Injectable()
export class WeatherService implements IWeatherInputPort {
  constructor(private readonly getWeatherUseCase: GetWeatherUseCase) {}

  async getWeather(city: string): Promise<Weather> {
    return this.getWeatherUseCase.getWeather(city);
  }
}
