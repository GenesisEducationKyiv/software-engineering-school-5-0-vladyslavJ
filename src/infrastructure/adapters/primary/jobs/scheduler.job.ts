import cron from 'node-cron';
import { container } from '../../../di/container';
import { WeatherDigestJob } from '../jobs/weather-digest.job';
import CRON_FREQUENCY from '../../../../shared/utils/constants/cron.constant';
import CRON_TIMEZONE from '../../../../shared/utils/constants/timezone.constant';

const job = container.resolve(WeatherDigestJob);

const cronOptions = {
  timezone: CRON_TIMEZONE.KYIV,
};

cron.schedule(
  CRON_FREQUENCY.HOURLY,
  async () => {
    await job.runHourly();
  },
  cronOptions,
);

cron.schedule(
  CRON_FREQUENCY.DAILY,
  async () => {
    await job.runDaily();
  },
  cronOptions,
);
