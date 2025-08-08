import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IHttpClient } from './interfaces/http-client.interface';

@Injectable()
export class HttpClient implements IHttpClient {
  async get(url: string, options?: RequestInit): Promise<Response> {
    const maxRetries = 3;
    const delayMs = 500;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fetch(url, options);
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise(res => setTimeout(res, delayMs));
        }
      }
    }
    throw new RpcException({
      message: 'Fetch failed',
      attempts: maxRetries,
      error: String(lastError),
      url,
    });
  }
}
