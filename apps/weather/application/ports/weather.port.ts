import { Weather } from '../../../../libs/common/models/weather.model';

export interface IWeatherInputPort {
  getWeather(city: string): Promise<Weather>;
}
