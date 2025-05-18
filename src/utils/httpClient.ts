// src/utils/httpClient.ts

import axios, { AxiosError } from 'axios';
import ENV from '../config/env';
import { HttpError } from './customError';

const http = axios.create({
	baseURL: ENV.WEATHER_BASE_URL,
	timeout: 21_000,
	params: {
		key: ENV.WEATHER_API_KEY,
		aqi: 'no',
	},
});

http.interceptors.response.use(
	(res) => res,
	(error: AxiosError<any>) => {
		const apiCode = error.response?.data?.error?.code;
		if (apiCode === 1006) {
			return Promise.reject(new HttpError('City not found', 404));
		}

		if (
			error.code === 'ECONNABORTED' ||
			error.message?.includes('timeout')
		) {
			return Promise.reject(new HttpError('External API timeout', 504));
		}

		const status = error.response?.status ?? 502;
		return Promise.reject(
			error instanceof HttpError
				? error
				: new HttpError(error.message || 'External API error', status)
		);
	}
);

export default http;
