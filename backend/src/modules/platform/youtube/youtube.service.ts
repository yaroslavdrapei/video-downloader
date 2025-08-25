import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@src/infrastructure/redis/redis.service';
import { IDownloaderToken } from '@src/modules/downloader/downloader.constants';
import type { IDownloader } from '@src/modules/downloader/downloader.interface';
import { DownloadResult, IPlatform } from '@src/modules/platform/platform.interface';
import { Info } from '@src/shared/types/info.type';
import { FORMATS_CACHE_TIME } from '../platform.constants';

const DEFAULT_AUDIO_FORMAT_ID = '140';
const BAD_YT_FORMAT_IDS = ['394', '395', '396', '397', '398', '399', '400', '401', '402', '140-drc'];
const supportedExts = ['mp4', 'm4a', 'mp3'];

@Injectable()
export class YoutubeService implements IPlatform {
	constructor(
		@Inject(IDownloaderToken) private readonly downloaderService: IDownloader,
		private readonly redisService: RedisService
	) {}

	async getInfo(link: string): Promise<Info> {
		const key = `info-${link}`;
		const infoString = await this.redisService.get(key);

		const info = infoString ? (JSON.parse(infoString) as Info) : await this.downloaderService.getInfo(link);

		info.formats = info.formats
			.filter((f) => {
				return !BAD_YT_FORMAT_IDS.includes(f.id) && supportedExts.includes(f.ext);
			})
			.map((f) => ({
				...f,
				ext: f.ext === 'm4a' ? 'mp3' : f.ext
			}));

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

		const stream =
			format.acodec == 'none'
				? await this.downloaderService.mergeDownload(link, formatId, DEFAULT_AUDIO_FORMAT_ID)
				: await this.downloaderService.basicDownload(link, formatId);

		return {
			stream,
			title: info.title,
			fileExtension: format.vcodec == 'none' ? 'mp3' : 'mp4'
		};
	}
}
