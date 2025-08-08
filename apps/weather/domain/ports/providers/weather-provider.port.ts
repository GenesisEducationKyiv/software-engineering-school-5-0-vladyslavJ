import { Weather } from '../../../../../libs/common/models/weather.model';

export interface IWeatherProviderPort {
  fetchCurrentWeather(city: string): Promise<Weather>;
}
