import nodemailer from 'nodemailer';
import ENV from '../config/env';

(async () => {
	try {
		const transporter = nodemailer.createTransport({
			host: ENV.MAIL_HOST,
			port: ENV.MAIL_PORT,
			secure: ENV.MAIL_SECURE,
			auth: { user: ENV.MAIL_USER, pass: ENV.MAIL_PASS },
		});
		await transporter.verify();
		console.log('SMTP OK');
		process.exit(0);
	} catch (e) {
		console.error('SMTP ERROR', e);
		process.exit(1);
	}
})();
