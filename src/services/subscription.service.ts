import { HttpError } from '../utils/customError';
import { subscriptionRepository } from '../repositories/subscription.repository';
import { Frequency } from '../models/subscription.entity';
import { sendMail } from '../utils/mailer';
import { confirmTpl, goodbyeTpl, confirmedTpl } from '../utils/templates';
import { QueryFailedError } from 'typeorm';
import { logger } from '../utils/logger';
import { genToken } from '../utils/genToken';

class SubscriptionService {
  async subscribe(email: string, city: string, frequency: Frequency): Promise<void> {
    logger.info(`Trying to subscribe: email=${email}, city=${city}, frequency=${frequency}`);
    const exists = await subscriptionRepository.findExisting(email, city, frequency);
    if (exists) {
      logger.warn(
        `Subscription already exists: email=${email}, city=${city}, frequency=${frequency}`,
      );
      throw new HttpError('Email already subscribed', 409);
    }

    const confirmation_token = genToken();
    const unsubscribe_token = genToken();

    await subscriptionRepository.save({
      email,
      city,
      frequency,
      confirmation_token,
      unsubscribe_token,
    });

    logger.info(`Subscription created: email=${email}, city=${city}, frequency=${frequency}`);

    await sendMail({
      to: email,
      ...confirmTpl(confirmation_token),
    });
    logger.info(`Confirmation email sent: email=${email}`);
  }

  async confirm(rawToken: string): Promise<void> {
    const token = rawToken.trim();
    logger.info(`Trying to confirm subscription with token: ${token}`);

    let sub;
    try {
      sub = await subscriptionRepository.findByToken(token, 'confirmation_token');
    } catch (err) {
      logger.error(`Error finding subscription by token: ${token}`, err);
      if (err instanceof QueryFailedError) {
        throw new HttpError('Invalid token format', 400);
      }
      throw err;
    }

    if (!sub) {
      logger.warn(`Confirmation token not found: ${token}`);
      throw new HttpError('Token not found', 404);
    }
    if (sub.confirmed) {
      logger.info(`Subscription already confirmed: email=${sub.email}`);
      return;
    }

    sub.confirmed = true;
    try {
      await subscriptionRepository.save(sub);
      await sendMail({
        to: sub.email,
        ...confirmedTpl(sub.email, sub.city, sub.frequency, sub.unsubscribe_token),
      });
      logger.info(`Subscription confirmed: email=${sub.email}`);
    } catch (err) {
      logger.error(`Error saving subscription confirmation: email=${sub.email}`, err);
      if (err instanceof QueryFailedError) {
        throw new HttpError('DB update error', 500);
      }
      throw err;
    }
  }
  async unsubscribe(token: string): Promise<void> {
    logger.info(`Trying to unsubscribe with token: ${token}`);
    const sub = await subscriptionRepository.findByToken(token, 'unsubscribe_token');
    if (!sub) {
      logger.warn(`Unsubscribe token not found: ${token}`);
      throw new HttpError('Token not found', 404);
    }

    await sendMail({
      to: sub.email,
      ...goodbyeTpl(sub.city),
    });
    logger.info(`Goodbye email sent: email=${sub.email}`);

    await subscriptionRepository.remove(sub);
    logger.info(
      `Subscription removed: email=${sub.email}, city=${sub.city}, frequency=${sub.frequency}`,
    );
  }
}

export default new SubscriptionService();
