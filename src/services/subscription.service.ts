import { injectable, inject } from 'tsyringe';
import { HttpError } from '../utils/custom-error.util';
import { ISubscriptionRepository } from '../interfaces/subscription-repository.interface';
import { Frequency } from '../models/subscription.entity';
import { IEmailService } from '../interfaces/email-service.interface';
import { confirmTpl, goodbyeTpl, confirmedTpl } from '../utils/email-templates.util';
import { QueryFailedError } from 'typeorm';
import { ILogger } from '../interfaces/logger-service.interface';
import { TOKENS } from '../config/di-tokens.config';
import { genToken } from '../utils/gen-token.util';

@injectable()
export class SubscriptionService {
  constructor(
    @inject(TOKENS.IEmailService) private readonly mail: IEmailService,
    @inject(TOKENS.ISubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
  ) {}

  async subscribe(email: string, city: string, frequency: Frequency) {
    this.logger.info(`Trying to subscribe: email=${email}, city=${city}, frequency=${frequency}`);

    if (await this.subscriptionRepository.findExisting(email, city, frequency)) {
      this.logger.warn(`Subscription already exists`);
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
    this.logger.info(`Subscription created & confirmation email sent`);
  }

  async confirm(rawToken: string) {
    const token = rawToken.trim();
    this.logger.info(`Confirm token: ${token}`);

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
    this.logger.info(`Subscription confirmed: email=${sub.email}`);
  }

  async unsubscribe(token: string) {
    this.logger.info(`Unsubscribe token: ${token}`);

    const sub = await this.subscriptionRepository.findByToken(token, 'unsubscribe_token');
    if (!sub) throw new HttpError('Token not found', 404);

    await this.mail.send({ to: sub.email, ...goodbyeTpl(sub.city) });
    await this.subscriptionRepository.remove(sub);
    this.logger.info(`Subscription removed: email=${sub.email}`);
  }
}
