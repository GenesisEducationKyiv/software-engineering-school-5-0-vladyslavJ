import { randomBytes } from 'crypto';
import { HttpError } from '../utils/customError';
import { subscriptionRepository } from '../repositories/subscription.repository';
import { Frequency } from '../models/subscription.entity';
import { sendMail } from '../utils/mailer';
import { confirmTpl, goodbyeTpl } from '../utils/templates';
import { QueryFailedError } from 'typeorm';

const genToken = () => randomBytes(32).toString('hex');

class SubscriptionService {
	async subscribe(
		email: string,
		city: string,
		frequency: Frequency
	): Promise<void> {
		const exists = await subscriptionRepository.findExisting(
			email,
			city,
			frequency
		);
		if (exists) throw new HttpError('Email already subscribed', 409);

		const confirmation_token = genToken();
		const unsubscribe_token = genToken();

		await subscriptionRepository.save({
			email,
			city,
			frequency,
			confirmation_token,
			unsubscribe_token,
		});

		await sendMail({
			to: email,
			...confirmTpl(confirmation_token),
		});
	}

	async confirm(rawToken: string): Promise<void> {
		const token = rawToken.trim();

		let sub;
		try {
			sub = await subscriptionRepository.findByToken(
				token,
				'confirmation_token'
			);
		} catch (err) {
			if (err instanceof QueryFailedError) {
				throw new HttpError('Invalid token format', 400);
			}
			throw err;
		}

		if (!sub) throw new HttpError('Token not found', 404);
		if (sub.confirmed) return;

		sub.confirmed = true;
		try {
			await subscriptionRepository.save(sub);
		} catch (err) {
			if (err instanceof QueryFailedError) {
				throw new HttpError('DB update error', 500);
			}
			throw err;
		}
	}
	async unsubscribe(token: string): Promise<void> {
		const sub = await subscriptionRepository.findByToken(
			token,
			'unsubscribe_token'
		);
		if (!sub) throw new HttpError('Token not found', 404);

		await sendMail({
			to: sub.email,
			...goodbyeTpl(sub.city),
		});

		await subscriptionRepository.remove(sub);
	}
}

export default new SubscriptionService();
