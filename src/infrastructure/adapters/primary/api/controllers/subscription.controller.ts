import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../../di/di-tokens';
import { ISubscriptionInputPort } from '../../../../../application/ports/subscription.port';
import { SubscriptionFrequency } from '../../../../../shared/enums/subscription-frequency.enum';

@injectable()
export class SubscriptionController {
  constructor(
    @inject(TOKENS.ISubscriptionInputPort)
    private readonly subscriptionService: ISubscriptionInputPort,
  ) {}

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, city, frequency } = req.body as {
        email: string;
        city: string;
        frequency: SubscriptionFrequency;
      };
      await this.subscriptionService.subscribe(email, city, frequency);
      res.status(200).json({ message: 'Subscription successful. Confirmation email sent.' });
    } catch (err) {
      next(err);
    }
  };

  confirmSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.subscriptionService.confirm(req.params.token);
      res.status(200).json({ message: 'Subscription confirmed successfully' });
    } catch (err) {
      next(err);
    }
  };

  unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.subscriptionService.unsubscribe(req.params.token);
      res.status(200).json({ message: 'Unsubscribed successfully' });
    } catch (err) {
      next(err);
    }
  };
}
