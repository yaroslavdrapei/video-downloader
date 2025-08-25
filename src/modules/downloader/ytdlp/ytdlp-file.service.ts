import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IDownloader } from '@src/modules/downloader/downloader.interface';
import { Info } from '@src/shared/types/info.type';
import { Readable } from 'stream';
import { YtDlp } from 'ytdlp-nodejs';
import { Mapper } from '@shared/mapper/mapper';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import sanitize from 'sanitize-filename';
import { OUTPUT_DIR } from '../downloader.constants';

// TODO: broken installation of ffmpeg, fix later, use the default from lib rn

@Injectable()
export class YtdlpFileService implements IDownloader {
	private readonly logger = new Logger(YtdlpFileService.name);
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

	async basicDownload(link: string, formatId: string): Promise<Readable> {
		const fullpath = `${OUTPUT_DIR}/${sanitize(link)}.mp3`;
		await this.ytdlp.downloadAsync(link, { format: formatId, output: fullpath });
		const readstream = createReadStream(fullpath);
		this.cleanupWhenDone(readstream, fullpath);

		return readstream;
	}

	async mergeDownload(link: string, formatId: string, audioFormatId: string): Promise<Readable> {
		const fullpath = `${OUTPUT_DIR}/${sanitize(link)}.mp4`;
		await this.ytdlp.downloadAsync(link, {
			format: `${formatId}+${audioFormatId}`,
			output: fullpath,
			mergeOutputFormat: 'mp4'
		});
		const readstream = createReadStream(fullpath);
		this.cleanupWhenDone(readstream, fullpath);

		return readstream;
	}

	private cleanupWhenDone(stream: Readable, filepath: string): void {
		stream.on('error', () => {
			unlink(filepath).catch(() => this.logger.error(`Error deleting ${filepath}`));
		});
		stream.on('close', () => {
			unlink(filepath).catch(() => this.logger.error(`Error deleting ${filepath}`));
		});
	}
}
