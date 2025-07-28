import { Weather } from '../../../../../../../libs/common/models/weather.model';
import { WeatherMicroserviceInterface } from '../../../../../../../libs/common/interfaces/weather-microservice.interface';

export interface WeatherServiceClientInterface extends WeatherMicroserviceInterface {
  getWeather(req: { city: string }): Promise<Weather>;
}
