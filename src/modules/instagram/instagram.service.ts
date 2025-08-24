import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@src/infrastructure/redis/redis.service';
import { IDownloaderToken } from '@src/shared/constants/tokens';
import type { IDownloader } from '@src/shared/interfaces/downloader.interface';
import { DownloadResult, IPlatform } from '@src/shared/interfaces/platform.interface';
import { Info } from '@src/shared/types/info.type';
import { Readable } from 'stream';

@Injectable()
export class InstagramService implements IPlatform {
	constructor(
		@Inject(IDownloaderToken) private readonly downloaderService: IDownloader,
		private readonly redisService: RedisService
	) {}

	async getInfo(link: string): Promise<Info> {
		const info = await this.downloaderService.getInfo(link);
		return info;
	}

	async download(link: string, formatId: string): Promise<DownloadResult> {
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

		let stream: Readable;

		if (format.acodec == 'video only') {
			const audioFormat = formats.find((f) => f.vcodec == 'none')!;
			stream = this.downloaderService.mergeDownload(link, formatId, audioFormat.id);
		} else {
			stream = this.downloaderService.basicDownload(link, formatId);
		}

		return {
			stream,
			title: info.title,
			fileExtension: format.vcodec == 'none' ? 'mp3' : 'mp4'
		};
	}
}
