import { Request, Response, NextFunction } from 'express';
import SubscriptionService from '../services/subscription.service';

export const subscribe = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, city, frequency } = req.body;
		await SubscriptionService.subscribe(email, city, frequency);
		res.status(200).json({
			message: 'Subscription successful. Confirmation email sent.',
		});
	} catch (err) {
		next(err);
	}
};

export const confirmSubscription = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await SubscriptionService.confirm(req.params.token);
		res.status(200).json({
			message: 'Subscription confirmed successfully',
		});
	} catch (err) {
		next(err);
	}
};

export const unsubscribe = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await SubscriptionService.unsubscribe(req.params.token);
		res.status(200).json({ message: 'Unsubscribed successfully' });
	} catch (err) {
		next(err);
	}
};
