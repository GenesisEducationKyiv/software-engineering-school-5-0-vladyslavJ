export interface IOpenWeatherMapWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface IOpenWeatherMapMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface IOpenWeatherMapWind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface IOpenWeatherMapClouds {
  all: number;
}

export interface IOpenWeatherMapRain {
  '1h'?: number;
  '3h'?: number;
}

export interface IOpenWeatherMapSys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface IOpenWeatherMapCoord {
  lon: number;
  lat: number;
}

export interface IOpenWeatherMapResponse {
  coord: IOpenWeatherMapCoord;
  weather: IOpenWeatherMapWeather[];
  base: string;
  main: IOpenWeatherMapMain;
  visibility: number;
  wind: IOpenWeatherMapWind;
  rain?: IOpenWeatherMapRain;
  clouds: IOpenWeatherMapClouds;
  dt: number;
  sys: IOpenWeatherMapSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
