import { Weather } from '../../../../../../libs/common/interfaces/weather.interface';

export interface IWeatherService {
  getWeather(city: string): Promise<Weather>;
}
