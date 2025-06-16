import cron from 'node-cron';
import { container } from '../container';
import { WeatherDigestJob } from './weatherDigest.job';
import CONSTANTS from '../config/constants';

const job = container.resolve(WeatherDigestJob);

cron.schedule(CONSTANTS.CRON_HOURLY, async () => {
  await job.runHourly();
});

cron.schedule(CONSTANTS.CRON_DAILY, async () => {
  await job.runDaily();
});
