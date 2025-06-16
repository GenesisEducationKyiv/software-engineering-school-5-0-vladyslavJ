import 'reflect-metadata';
import '../container';
import { container } from 'tsyringe';
import { IMailTransport } from '../clients/mailer.client';
import { ILogger } from '../services/logger.service';
import { TOKENS } from '../config/di.tokens';

(async () => {
  const logger = container.resolve<ILogger>(TOKENS.ILogger);
  const transport = container.resolve<IMailTransport>(TOKENS.IMailTransport);

  try {
    await transport.verify();
    logger.info('[MAIL] Transport successfully verified');
    process.exit(0);
  } catch (err: unknown) {
    logger.error('[MAIL] Transport verification error', err);
    process.exit(1);
  }
})();
