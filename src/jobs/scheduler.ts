// src/jobs/scheduler.ts

import cron from 'node-cron';
import WeatherDigestJob from './weatherDigest.job';

cron.schedule('0 0 * * * *', () => WeatherDigestJob.runHourly());
cron.schedule('0 0 7 * * *', () => WeatherDigestJob.runDaily());
