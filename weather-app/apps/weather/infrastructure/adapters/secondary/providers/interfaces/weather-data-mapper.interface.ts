import { Weather } from '../../../../../../../libs/common/models/weather.model';

export interface IWeatherMapper<T> {
  mapCurrentWeather(apiResponse: T): Weather;
}
