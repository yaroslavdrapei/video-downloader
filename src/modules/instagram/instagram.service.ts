import { Inject, Injectable } from '@nestjs/common';
import { IDownloaderToken } from '@src/shared/constants/tokens';
import type { IDownloader } from '@src/shared/interfaces/downloader.interface';
import { IPlatform } from '@src/shared/interfaces/platform.interface';
import { Info } from '@src/shared/types/info.type';
import { Readable } from 'stream';

@Injectable()
export class InstagramService implements IPlatform {
	constructor(@Inject(IDownloaderToken) private readonly downloaderService: IDownloader) {}

	async getInfo(link: string): Promise<Info> {
		const info = await this.downloaderService.getInfo(link);
		return info;
	}

	download(link: string, formatId: string): Readable {
		const stream = this.downloaderService.basicDownload(link, formatId);
		return stream;
	}
}
