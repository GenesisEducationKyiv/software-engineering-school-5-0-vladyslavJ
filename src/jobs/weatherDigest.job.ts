// src/jobs/weatherDigest.job.ts

import { format } from 'date-fns';
import WeatherService from '../services/weather.service';
import { subscriptionRepository } from '../repositories/subscription.repository';
import { sendMail } from '../utils/mailer';
import { digestTpl } from '../utils/templates';

class WeatherDigestJob {
	private static async process(frequency: 'hourly' | 'daily') {
		const subs = await subscriptionRepository.findConfirmedByFrequency(
			frequency
		);

		for (const sub of subs) {
			try {
				const weather = await WeatherService.getWeather(sub.city);
				await sendMail({
					to: sub.email,
					...digestTpl(
						sub.city,
						weather,
						format(new Date(), 'dd.MM.yyyy HH:mm'),
						sub.unsubscribe_token
					),
				});
			} catch (err) {
				console.error('[JOB] email send error', err);
			}
		}
	}

	static async runHourly() {
		console.log('[JOB] runHourly called at', new Date());
		await this.process('hourly');
	}
	static async runDaily() {
		await this.process('daily');
	}
}

export default WeatherDigestJob;
