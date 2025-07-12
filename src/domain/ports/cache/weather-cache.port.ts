import { Weather } from '../../models/weather.model';

export interface IWeatherCachePort {
  get(key: string): Promise<Weather | null>;
  set(key: string, value: Weather, ttlSeconds: number): Promise<void>;
}
