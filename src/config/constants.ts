export interface ConstConfig {
  CRON_HOURLY: string;
  CRON_DAILY: string;
  CITY_NOT_FOUND_CODE: number;
}

const CONSTANTS: Readonly<ConstConfig> = Object.freeze({
  CRON_HOURLY: '0 * * * *',
  CRON_DAILY: '0 7 * * *',
  CITY_NOT_FOUND_CODE: 1006,
});

export default CONSTANTS;
