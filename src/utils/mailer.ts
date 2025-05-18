// src/utils/mailer.ts

import nodemailer, { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import ENV from '../config/env';

const smtpOptions: SMTPTransport.Options = {
	host: ENV.MAIL_HOST,
	port: ENV.MAIL_PORT,
	secure: ENV.MAIL_SECURE ?? ENV.MAIL_PORT === 465, // true для TLS
	auth: { user: ENV.MAIL_USER, pass: ENV.MAIL_PASS },
};

const transporter: Transporter = nodemailer.createTransport(smtpOptions);

transporter
	.verify()
	.then(() => {
		console.log('[MAIL] SMTP connection is OK');
	})
	.catch((err) => {
		console.error('[MAIL] SMTP connection failed', err);
	});

export interface SendOptions {
	to: string;
	subject: string;
	html: string;
}

export const sendMail = (opts: SendOptions) =>
	transporter.sendMail({ from: ENV.MAIL_FROM, ...opts });
