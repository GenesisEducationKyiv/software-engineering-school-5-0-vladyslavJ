export interface IWeatherApiCondition {
  text: string;
}

export interface IWeatherApiCurrent {
  temp_c: number;
  humidity: number;
  condition: IWeatherApiCondition;
}

export interface IWeatherApiResponse {
  current: IWeatherApiCurrent;
}
