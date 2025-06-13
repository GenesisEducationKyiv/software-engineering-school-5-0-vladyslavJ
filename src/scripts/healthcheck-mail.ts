import nodemailer from 'nodemailer';
import ENV from '../config/env';
import { logger } from '../utils/logger';

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: ENV.MAIL_HOST,
      port: ENV.MAIL_PORT,
      secure: ENV.MAIL_SECURE,
      auth: { user: ENV.MAIL_USER, pass: ENV.MAIL_PASS },
    });
    await transporter.verify();
    logger.info('SMTP OK');
    process.exit(0);
  } catch (e) {
    logger.error('SMTP ERROR', e);
    process.exit(1);
  }
})();
