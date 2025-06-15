import { container } from '../container';
import { IMailTransport } from '../clients/mailer.client';
import { logger } from '../utils/logger';

(async () => {
  const transport = container.resolve<IMailTransport>('IMailTransport');
  try {
    await transport.verify();
    logger.log({ level: 'info', message: 'SMTP OK' });
    process.exit(0);
  } catch (err) {
    logger.log({ level: 'error', message: 'SMTP ERROR', error: err });
    process.exit(1);
  }
})();
