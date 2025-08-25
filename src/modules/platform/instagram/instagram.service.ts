import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@src/infrastructure/redis/redis.service';
import { FORMATS_CACHE_TIME } from '../platform.constants';
import type { IDownloader } from '@src/modules/downloader/downloader.interface';
import { DownloadResult, IPlatform } from '@src/modules/platform/platform.interface';
import { Info } from '@src/shared/types/info.type';
import { Readable } from 'stream';
import { IDownloaderToken } from '@src/modules/downloader/downloader.constants';

// TODO: fix merge for instagram, doesn't work for now

@Injectable()
export class InstagramService implements IPlatform {
	constructor(
		@Inject(IDownloaderToken) private readonly downloaderService: IDownloader,
		private readonly redisService: RedisService
	) {}

	async getInfo(link: string): Promise<Info> {
		const key = `info-${link}`;

		const infoString = await this.redisService.get(key);

		const info = infoString ? (JSON.parse(infoString) as Info) : await this.downloaderService.getInfo(link);

		await this.redisService.set(key, JSON.stringify(info), FORMATS_CACHE_TIME);

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

		if (format.acodec == 'none') {
			const audioFormat = formats.find((f) => f.vcodec == 'none')!;
			console.log('Merge', formatId, audioFormat.id);
			console.log(audioFormat);
			stream = await this.downloaderService.mergeDownload(link, formatId, audioFormat.id);
		} else {
			console.log('Basic');
			stream = await this.downloaderService.basicDownload(link, formatId);
		}

		return {
			stream,
			title: info.title,
			fileExtension: format.vcodec == 'none' ? 'mp3' : 'mp4'
		};
	}
}
