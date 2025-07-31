const CRON_FREQUENCY = Object.freeze({
  HOURLY: '0 * * * *',
  //HOURLY: '* * * * *',
  DAILY: '0 7 * * *',
} as const);

export default CRON_FREQUENCY;
