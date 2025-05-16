import ENV from '../config/env';
import { WeatherDto } from '../dto/weather.dto';

export const confirmTpl = (token: string) => ({
	subject: 'Confirm your subscription to the weather forecast',
	html: `
    <p>Hi!</p>
    <p>Click to confirm subscription:</p>
    <a href="${ENV.APP_BASE_URL}/api/confirm/${token}">Confirm</a>
  `,
});

export const goodbyeTpl = (city: string) => ({
	subject: `You have unsubscribed from the forecast for ${city}`,
	html: `<p>You have successfully unsubscribed from the newsletter.</p>`,
});

export const digestTpl = (
	city: string,
	w: WeatherDto,
	stamp: string,
	unsubscribeToken: string
) => ({
	subject: `Weather for ${city} – ${stamp}`,
	html: `
    <h2>Weather in ${city}</h2>
    <ul>
      <li><b>Temperature:</b> ${w.temperature} °C</li>
      <li><b>Humidity:</b> ${w.humidity}%</li>
      <li><b>Description:</b> ${w.description}</li>
    </ul>
    <p>Thank you for using our service!</p>
    <small>Unsubscribe: <a href="${process.env.APP_BASE_URL}/api/unsubscribe/${unsubscribeToken}">link</a></small>
  `,
});
