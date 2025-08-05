export interface CronServiceInterface {
  handleHourlyWeatherDigestCron(): Promise<void>;
  handleDailyWeatherDigestCron(): Promise<void>;
}
