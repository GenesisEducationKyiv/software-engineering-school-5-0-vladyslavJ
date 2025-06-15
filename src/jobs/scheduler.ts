import { container } from '../container';
import { WeatherDigestJob } from './weatherDigest.job';
import cron from 'node-cron';

const job = container.resolve(WeatherDigestJob);

cron.schedule('0 0 * * *', async () => {
  await job.runHourly();
});

cron.schedule('0 0 7 * *', async () => {
  await job.runDaily();
});
