import 'reflect-metadata';
import '../container';
import { container } from 'tsyringe';
import { IEmailTransport } from '../interfaces/email-client.interface';
import { ILogger } from '../interfaces/logger-service.interface';
import { TOKENS } from '../config/di-tokens.config';

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
})();
