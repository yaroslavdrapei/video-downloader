import { BadRequestException, Injectable } from '@nestjs/common';
import { IDownloader } from '@src/shared/interfaces/downloader.interface';
import { Info } from '@src/shared/types/info.type';
import { PassThrough, Readable } from 'stream';
import { VideoInfo, YtDlp } from 'ytdlp-nodejs';
import { Mapper } from '@shared/mapper/mapper';

@Injectable()
export class YtdlpService implements IDownloader {
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

	basicDownload(link: string, formatId: string): Readable {
		const stream = this.ytdlp.stream(link, { format: formatId });
		const readable = new PassThrough();
		stream.pipe(readable);
		return readable;
	}

	mergeDownload(link: string, formatId: string, audioFormatId: string): Readable {
		const stream = this.ytdlp.stream(link, { format: formatId + audioFormatId });
		const readable = new PassThrough();
		stream.pipe(readable);
		return readable;
	}
}
