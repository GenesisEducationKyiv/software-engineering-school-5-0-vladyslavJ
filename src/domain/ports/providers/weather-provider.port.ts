import { Weather } from '../../models/weather.model';

export interface IWeatherProviderPort {
  fetchCurrentWeather(city: string): Promise<Weather>;
  setNextProvider?(provider: IWeatherProviderPort): void;
}
