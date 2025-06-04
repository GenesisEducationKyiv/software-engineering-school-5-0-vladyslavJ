import nodemailer, { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { logger } from '../utils/logger';
import ENV from '../config/env';

const smtpOptions: SMTPTransport.Options = {
	host: ENV.MAIL_HOST,
	port: ENV.MAIL_PORT,
	secure: ENV.MAIL_SECURE ?? ENV.MAIL_PORT === 465, // true для TLS
	auth: { user: ENV.MAIL_USER, pass: ENV.MAIL_PASS },
};

const transporter: Transporter = nodemailer.createTransport(smtpOptions);

async function verifyWithRetry(attempts = 5, delayMs = 5000) {
	for (let i = 1; i <= attempts; i++) {
		try {
			await transporter.verify();
			logger.info(`[MAIL] SMTP connection is OK (try ${i})`);
			return;
		} catch (err) {
			logger.error(`[MAIL] SMTP connection failed (try ${i})`, err);
			if (i === attempts) throw err;
			await new Promise((res) => setTimeout(res, delayMs));
		}
	}
}

verifyWithRetry().catch(() => {
	logger.error('[MAIL] SMTP not available, emails will not be sent.');
});

export interface SendOptions {
	to: string;
	subject: string;
	html: string;
}

export const sendMail = (opts: SendOptions) =>
	transporter.sendMail({ from: ENV.MAIL_FROM, ...opts });
