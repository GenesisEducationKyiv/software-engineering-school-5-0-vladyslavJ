import { container } from '../container';
import { IMailTransport } from '../clients/mailer.client';

(async () => {
  const transport = container.resolve<IMailTransport>('IMailTransport');
  try {
    await transport.verify();
    console.log('SMTP OK');
    process.exit(0);
  } catch (e) {
    console.error('SMTP ERROR', e);
    process.exit(1);
  }
})();
