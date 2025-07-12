import { injectable, inject } from 'tsyringe';
import { Weather } from '../../domain/models/weather.model';
import { IWeatherInputPort } from '../ports/weather.port';
import { GetWeatherUseCase } from '../use-cases/weather/get-weather.use-case';

@injectable()
export class WeatherService implements IWeatherInputPort {
  constructor(@inject(GetWeatherUseCase) private getWeatherUseCase: GetWeatherUseCase) {}

  async getWeather(city: string): Promise<Weather> {
    return this.getWeatherUseCase.getWeather(city);
  }
}
