import { WeatherMicroserviceInterface } from "../../../../../../../libs/common/interfaces/weather-microservice.interface";
import { Weather } from "../../../../../../../libs/common/models/weather.model";

export interface WeatherServiceClientInterface extends WeatherMicroserviceInterface{
  getWeather(req: { city: string }): Promise<Weather>;
}
