import { injectable, inject } from 'tsyringe';
import { HttpError } from '../utils/customError';
import { ISubscriptionRepository } from '../repositories/subscription.repository';
import { Frequency } from '../models/subscription.entity';
import { IMailService } from './mail.service';
import { confirmTpl, goodbyeTpl, confirmedTpl } from '../utils/templates';
import { QueryFailedError } from 'typeorm';
import { logger } from '../utils/logger';
import { TOKENS } from '../config/di.tokens';
import { genToken } from '../utils/genToken';

@injectable()
export class SubscriptionService {
  constructor(
    @inject(TOKENS.IMailService) private readonly mail: IMailService,
    @inject(TOKENS.ISubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async subscribe(email: string, city: string, frequency: Frequency) {
    logger.info(`Trying to subscribe: email=${email}, city=${city}, frequency=${frequency}`);

    if (await this.subscriptionRepository.findExisting(email, city, frequency)) {
      logger.warn(`Subscription already exists`);
      throw new HttpError('Email already subscribed', 409);
    }

    const confirmation_token = genToken();
    const unsubscribe_token = genToken();

    await this.subscriptionRepository.save({
      email,
      city,
      frequency,
      confirmation_token,
      unsubscribe_token,
    });

    await this.mail.send({ to: email, ...confirmTpl(confirmation_token) });
    logger.info(`Subscription created & confirmation email sent`);
  }

  async confirm(rawToken: string) {
    const token = rawToken.trim();
    logger.info(`Confirm token: ${token}`);

    let sub;
    try {
      sub = await this.subscriptionRepository.findByToken(token, 'confirmation_token');
    } catch (err) {
      if (err instanceof QueryFailedError) throw new HttpError('Invalid token format', 400);
      throw err;
    }

    if (!sub) throw new HttpError('Token not found', 404);
    if (sub.confirmed) return;

    await this.subscriptionRepository.confirm(sub);
    await this.mail.send({
      to: sub.email,
      ...confirmedTpl(sub.email, sub.city, sub.frequency, sub.unsubscribe_token),
    });
    logger.info(`Subscription confirmed: email=${sub.email}`);
  }

  async unsubscribe(token: string) {
    logger.info(`Unsubscribe token: ${token}`);

    const sub = await this.subscriptionRepository.findByToken(token, 'unsubscribe_token');
    if (!sub) throw new HttpError('Token not found', 404);

    await this.mail.send({ to: sub.email, ...goodbyeTpl(sub.city) });
    await this.subscriptionRepository.remove(sub);
    logger.info(`Subscription removed: email=${sub.email}`);
  }
}
