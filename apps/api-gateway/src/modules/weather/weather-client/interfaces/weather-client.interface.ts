import { WeatherMicroserviceInterface } from '../../../../../../../libs/common/interfaces/weather-microservice.interface';
import { Weather } from '../../../../../../../libs/common/models/weather.model';
import { Empty } from '../../../../../../../libs/common/types/empty.type';

export interface WeatherServiceClientInterface extends WeatherMicroserviceInterface {
  getWeather(req: { city: string }): Promise<Weather>;
  getMetrics(req: Empty): Promise<{ metrics: string }>;
}
