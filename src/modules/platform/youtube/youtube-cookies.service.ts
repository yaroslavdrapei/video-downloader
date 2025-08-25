import { Injectable } from '@nestjs/common';
import { ICookieProvider } from '@src/shared/interfaces/cookie-provider.interface';

@Injectable()
export class YoutubeCookiesService implements ICookieProvider {
  get(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  fetch(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  expire(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
