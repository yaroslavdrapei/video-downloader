import { Injectable } from '@nestjs/common';
import { IDownloader } from '@src/shared/interfaces/downloader.interface';
import { Info } from '@src/shared/types/info.type';
import { Readable } from 'stream';

@Injectable()
export class YtdlpService implements IDownloader {
  getInfo(link: string): Promise<Info> {
    throw new Error('Method not implemented.');
  }
  basicDownload(link: string, formatId: string): Promise<Readable> {
    throw new Error('Method not implemented.');
  }
  mergeDownload(link: string, formatId: string): Promise<Readable> {
    throw new Error('Method not implemented.');
  }
}
