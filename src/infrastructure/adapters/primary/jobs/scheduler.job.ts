import cron from 'node-cron';
import { container } from '../../../di/container';
import { WeatherDigestJob } from '../jobs/weather-digest.job';
import CRON_FREQUENCY from '../../../../shared/utils/constants/cron.constant';

const job = container.resolve(WeatherDigestJob);

cron.schedule(CRON_FREQUENCY.HOURLY, async () => {
  await job.runHourly();
});

cron.schedule(CRON_FREQUENCY.DAILY, async () => {
  await job.runDaily();
});
