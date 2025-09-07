import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@src/infrastructure/redis/redis.service';
import { IDownloaderToken } from '@src/modules/downloader/downloader.constants';
import type { IDownloader } from '@src/modules/downloader/downloader.interface';
import { DownloadResult, IPlatform } from '@src/modules/platform/platform.interface';
import { Info } from '@src/shared/types/info.type';
import { FORMATS_CACHE_TIME } from '../platform.constants';
import { TaskInMemoryRepository } from '@src/infrastructure/repositories/task/task-in-memory.repository';
import { TaskStatus } from '@src/modules/task/task-status.enum';
import { Task } from '@src/modules/task/task.entity';
import { PlatformHelperService } from '@modules/platform/platfrom-helper.service';

const DEFAULT_AUDIO_FORMAT_ID = 'bestaudio';
const BAD_YT_FORMAT_IDS = ['394', '395', '396', '397', '398', '399', '400', '401', '402', '140-drc'];
const supportedExts = ['mp4', 'm4a', 'mp3'];

@Injectable()
export class YoutubeService implements IPlatform {
	constructor(
		@Inject(IDownloaderToken) private readonly downloaderService: IDownloader,
		private readonly redisService: RedisService,
		private readonly taskRepository: TaskInMemoryRepository,
		private readonly platformHelperService: PlatformHelperService
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

	async initialize(link: string, formatId: string): Promise<string> {
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

		const isMerge = format.acodec == 'none';

		const stream = isMerge
			? await this.downloaderService.mergeDownload(link, formatId, DEFAULT_AUDIO_FORMAT_ID)
			: await this.downloaderService.basicDownload(link, formatId);

		const task = await this.taskRepository.create({
			link,
			stream,
			approximateSize: format.filesize,
			format,
			title: info.title
		});

		this.platformHelperService.setupStreamListeners(task);

		return task.uuid;
	}

	async downloadV1(uuid: string): Promise<DownloadResult> {
		const task = await this.taskRepository.findById(uuid);

		if (!task) {
			throw new BadRequestException('Invalid task id');
		}

		if (task.status !== TaskStatus.READY_TO_SEND) {
			throw new BadRequestException('File cannot be downloaded');
		}

		const { title, format, stream } = task;

		return {
			stream,
			title,
			fileExtension: format.vcodec == 'none' ? 'mp3' : 'mp4'
		};
	}
}
