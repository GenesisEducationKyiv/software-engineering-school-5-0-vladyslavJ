import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { SubscriptionService } from '../services/subscription.service';
import { TOKENS } from '../config/di-tokens.config';

@injectable()
export class SubscriptionController {
  constructor(@inject(TOKENS.SubscriptionService) private readonly svc: SubscriptionService) {}

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, city, frequency } = req.body;
      await this.svc.subscribe(email, city, frequency);
      res.status(200).json({ message: 'Subscription successful. Confirmation email sent.' });
    } catch (err) {
      next(err);
    }
  };

  confirmSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.svc.confirm(req.params.token);
      res.status(200).json({ message: 'Subscription confirmed successfully' });
    } catch (err) {
      next(err);
    }
  };

  unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.svc.unsubscribe(req.params.token);
      res.status(200).json({ message: 'Unsubscribed successfully' });
    } catch (err) {
      next(err);
    }
  };
}
