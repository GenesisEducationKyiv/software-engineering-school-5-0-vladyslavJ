import { Weather } from '../../domain/models/weather.model';

export interface IWeatherInputPort {
  getWeather(city: string): Promise<Weather>;
}
