import { injectable } from 'tsyringe';
import { Weather } from '../../../../../../../libs/common/models/weather.model';
import { IWeatherMapper } from '../interfaces/weather-data-mapper.interface';
import { IWeatherApiResponse } from '../interfaces/weather-api-response.interface';

@injectable()
export class WeatherApiMapper implements IWeatherMapper<IWeatherApiResponse> {
  mapCurrentWeather(apiResponse: IWeatherApiResponse): Weather {
    return new Weather(
      apiResponse.current.temp_c,
      apiResponse.current.humidity,
      apiResponse.current.condition.text,
    );
  }
}
