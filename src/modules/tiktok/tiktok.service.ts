import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@src/infrastructure/redis/redis.service';
import { IDownloaderToken } from '@src/shared/constants/tokens';
import type { IDownloader } from '@src/shared/interfaces/downloader.interface';
import { IPlatform } from '@src/shared/interfaces/platform.interface';
import { Info } from '@src/shared/types/info.type';
import { Readable } from 'stream';

@Injectable()
export class TiktokService implements IPlatform {
	constructor(
		@Inject(IDownloaderToken) private readonly downloaderService: IDownloader,
		private readonly redisService: RedisService
	) {}

	async getInfo(link: string): Promise<Info> {
		const info = await this.downloaderService.getInfo(link);
		return info;
	}

	async download(link: string, formatId: string): Promise<Readable> {
		const key = `info-${link}`;
		const infoString = await this.redisService.get(key);

		if (!infoString) {
			throw new BadRequestException("Formats for this video couldn't be retrieved, try again");
		}

		const info = JSON.parse(infoString) as Info;
		const formats = info.formats;

		const format = formats.find((f) => f.id === formatId);

		if (!format) {
			throw new BadRequestException('Invalid format id');
		}

		return this.downloaderService.basicDownload(link, formatId);
	}
}
