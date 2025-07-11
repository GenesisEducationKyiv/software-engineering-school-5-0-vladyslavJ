import { Weather } from '../../../../../domain/models/weather.model';

export interface IWeatherMapper<T> {
  mapCurrentWeather(apiResponse: T): Weather;
}
