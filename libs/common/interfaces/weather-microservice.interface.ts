import { Weather } from "../models/weather.model";

export interface WeatherMicroserviceInterface {
  getWeather(req: { city: string }): Promise<Weather>;
}