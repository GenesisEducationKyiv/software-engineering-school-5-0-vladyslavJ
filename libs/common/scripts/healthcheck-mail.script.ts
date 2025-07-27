/*import 'reflect-metadata';
import '../../infrastructure/di/container';
import { container } from 'tsyringe';
import { IEmailTransport } from '../../infrastructure/interfaces/email-transport.interface';
import { ILogger } from '../interfaces/logger-service.interface';
import { TOKENS } from '../../infrastructure/di/di-tokens';

(async () => {
  const logger = container.resolve<ILogger>(TOKENS.ILogger);
  const transport = container.resolve<IEmailTransport>(TOKENS.IEmailTransport);

  try {
    await transport.verify();
    logger.info('[MAIL] Transport successfully verified');
    process.exit(0);
  } catch (err: unknown) {
    logger.error('[MAIL] Transport verification error', err);
    process.exit(1);
  }
})();*/
