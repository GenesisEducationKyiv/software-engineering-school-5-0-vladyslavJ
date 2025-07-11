import { injectable } from 'tsyringe';
import { Weather } from '../../../../../domain/models/weather.model';
import { IWeatherMapper } from '../interfaces/weather-data-mapper.interface';
import { IOpenWeatherMapResponse } from '../interfaces/open-weather-map-response.interface';

@injectable()
export class OpenWeatherMapMapper implements IWeatherMapper<IOpenWeatherMapResponse> {
  mapCurrentWeather(apiResponse: IOpenWeatherMapResponse): Weather {
    return new Weather(
      apiResponse.main.temp,
      apiResponse.main.humidity,
      apiResponse.weather[0]?.description || 'Нет описания',
    );
  }
}
