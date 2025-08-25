import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IDownloader } from '@src/modules/downloader/downloader.interface';
import { Info } from '@src/shared/types/info.type';
import { PassThrough, Readable } from 'stream';
import { YtDlp } from 'ytdlp-nodejs';
import { Mapper } from '@shared/mapper/mapper';

// TODO: broken installation of ffmpeg, fix later, use the default from lib rn

@Injectable()
export class YtdlpStreamService implements IDownloader {
	private readonly logger = new Logger(YtdlpStreamService.name);
	private ytdlp: YtDlp;

	constructor(private readonly mapper: Mapper) {
		this.ytdlp = new YtDlp({
			binaryPath: './binaries/yt-dlp',
			ffmpegPath: './binaries/ffmpeg'
		});
	}

	async getInfo(link: string): Promise<Info> {
		const ytdlpInfo = await this.ytdlp.getInfoAsync(link);

		if (ytdlpInfo._type == 'playlist') {
			throw new BadRequestException('No support for playlists yet');
		}

		return this.mapper.mapYtdlpInfo(ytdlpInfo);
	}

	basicDownload(link: string, formatId: string): Promise<Readable> {
		const stream = this.ytdlp.stream(link, {
			format: formatId,
			onProgress: (p) => {
				this.logger.log(p);
			}
		});
		const readable = new PassThrough();
		stream.pipe(readable);

		return Promise.resolve(readable);
	}

	mergeDownload(link: string, formatId: string, audioFormatId: string): Promise<Readable> {
		const stream = this.ytdlp.stream(link, {
			format: `${formatId}+${audioFormatId}`,
			additionalOptions: ['--http-chunk-size', '20M']
		});
		const readable = new PassThrough({ highWaterMark: 1024 * 1024 });
		stream.pipe(readable);

		return Promise.resolve(readable);
	}
}
