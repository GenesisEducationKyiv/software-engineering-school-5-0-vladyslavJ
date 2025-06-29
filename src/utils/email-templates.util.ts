import ENV from '../config/env';
import { WeatherDto } from '../dto/weather.dto';

export const confirmTpl = (token: string) => ({
  subject: 'Confirm your subscription to the weather digest',
  html: `
		<div style="font-family:sans-serif; background:#f1f5f9; padding:24px">
			<div style="max-width:420px;margin:auto;background:white;border-radius:12px;padding:32px 20px;text-align:center;box-shadow:0 2px 16px #0001;">
				<h2 style="color:#2563eb;">Subscription Confirmation</h2>
				<p>Thank you for subscribing! To receive weather updates, please confirm your subscription:</p>
				<a href="${ENV.APP_BASE_URL}/api/confirm/${token}" style="display:inline-block;padding:10px 22px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;font-size:1.1rem;">Confirm</a>
				<p style="margin-top:22px;color:#64748b;">If you did not subscribe — just ignore this email.</p>
			</div>
		</div>
	`,
});

export const goodbyeTpl = (city: string) => ({
  subject: `You have unsubscribed from weather updates for ${city}`,
  html: `
		<div style="font-family:sans-serif; background:#f1f5f9; padding:24px">
			<div style="max-width:420px;margin:auto;background:white;border-radius:12px;padding:32px 20px;text-align:center;box-shadow:0 2px 16px #0001;">
				<h2 style="color:#ef4444;">You have unsubscribed!</h2>
				<p>You will no longer receive weather updates for <b>${city}</b>.<br>Thank you for using our service.</p>
				<p style="margin-top:20px;color:#64748b;font-size:0.95rem;">If this was a mistake, you can always subscribe again on our website.</p>
			</div>
		</div>
	`,
});

export const digestTpl = (
  city: string,
  w: WeatherDto,
  stamp: string,
  unsubscribeToken: string,
) => ({
  subject: `Weather for ${city} – ${stamp}`,
  html: `
		<div style="font-family:sans-serif; background:#f1f5f9; padding:24px">
			<div style="max-width:420px;margin:auto;background:white;border-radius:12px;padding:32px 20px;box-shadow:0 2px 16px #0001;">
				<h2 style="color:#2563eb;margin-top:0;">Weather in ${city}</h2>
				<ul style="list-style:none;padding:0;margin:0 0 24px 0;">
					<li style="margin-bottom:8px;"><b>Temperature:</b> <span style="color:#0ea5e9">${w.temperature} °C</span></li>
					<li style="margin-bottom:8px;"><b>Humidity:</b> <span style="color:#38bdf8">${w.humidity}%</span></li>
					<li><b>Description:</b> <span style="color:#334155">${w.description}</span></li>
				</ul>
				<p style="margin:18px 0 0 0;color:#64748b;font-size:0.97rem;">Thank you for choosing our weather service!</p>
				<hr style="margin:24px 0;">
				<small style="color:#64748b;">Unsubscribe: 
					<a href="${ENV.APP_BASE_URL}/api/unsubscribe/${unsubscribeToken}" style="color:#ef4444;text-decoration:none;">click here</a>
				</small>
			</div>
		</div>
	`,
});

export const confirmedTpl = (
  email: string,
  city: string,
  frequency: string,
  unsubscribeToken: string,
) => ({
  subject: 'Your weather subscription is confirmed!',
  html: `
		<div style="font-family:sans-serif; background:#f1f5f9; padding:24px">
			<div style="max-width:420px;margin:auto;background:white;border-radius:12px;padding:32px 20px;text-align:center;box-shadow:0 2px 16px #0001;">
				<h2 style="color:#22c55e;">Subscription Confirmed!</h2>
				<p>
					Thank you, your subscription for weather updates in <b>${city}</b>
					(${frequency === 'hourly' ? 'hourly' : 'daily'}) has been <b>successfully confirmed</b>!
				</p>
				<p>
					You will receive weather digests at: <b>${email}</b>
				</p>
				<hr style="margin:24px 0;">
				<small style="color:#64748b;">
					Unsubscribe any time:
					<a href="${
            ENV.APP_BASE_URL
          }/api/unsubscribe/${unsubscribeToken}" style="color:#ef4444;text-decoration:none;">
						click here
					</a>
				</small>
			</div>
		</div>
	`,
});
