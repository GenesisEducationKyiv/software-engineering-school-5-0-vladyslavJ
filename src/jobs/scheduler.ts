import cron from 'node-cron';
import { container } from '../container';
import { WeatherDigestJob } from './weatherDigest.job';
import CRON_FREQUENCY from '../utils/constants/cron.constants';

const job = container.resolve(WeatherDigestJob);

cron.schedule(CRON_FREQUENCY.HOURLY, async () => {
  await job.runHourly();
});

cron.schedule(CRON_FREQUENCY.DAILY, async () => {
  await job.runDaily();
});
