import { Injectable } from '@nestjs/common';
import { IHttpClient } from './interfaces/http-client.interface';

@Injectable()
export class HttpClient implements IHttpClient {
  get(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, options);
  }
}
