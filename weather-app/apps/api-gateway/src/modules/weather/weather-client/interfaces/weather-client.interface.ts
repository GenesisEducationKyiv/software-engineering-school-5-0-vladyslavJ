import { Weather } from "../../../../../../../libs/common/models/weather.model";

export interface WeatherServiceClientInterface {
  getWeather(req: { city: string }): Promise<Weather>;
}
