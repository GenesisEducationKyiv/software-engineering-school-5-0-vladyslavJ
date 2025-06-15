import { format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { WeatherService } from '../services/weather.service';
import { subscriptionRepository } from '../repositories/subscription.repository';
import { sendMail } from '../utils/mailer';
import { digestTpl } from '../utils/templates';
import { logger } from '../utils/logger';

@injectable()
export class WeatherDigestJob {
  constructor(@inject(WeatherService) private readonly weatherService: WeatherService) {}

  private async process(frequency: 'hourly' | 'daily') {
    const subs = await subscriptionRepository.findConfirmedByFrequency(frequency);

    for (const sub of subs) {
      try {
        const weather = await this.weatherService.getWeather(sub.city);
        await sendMail({
          to: sub.email,
          ...digestTpl(
            sub.city,
            weather,
            format(new Date(), 'dd.MM.yyyy HH:mm'),
            sub.unsubscribe_token,
          ),
        });
      } catch (err) {
        logger.error('[JOB] email send error', err);
      }
    }
  }

  runHourly = () => this.process('hourly');
  runDaily = () => this.process('daily');
}
