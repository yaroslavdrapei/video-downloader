import { Module } from '@nestjs/common';
import { YtdlpModule } from './ytdlp/ytdlp.module';
import { IDownloaderToken } from '@src/shared/constants/tokens';
import { YtdlpStreamService } from './ytdlp/ytdlp-stream.service';
import { ConfigService } from '@nestjs/config';
import { DownloaderType, DownloadStrategy } from '@src/shared/constants/constants';
import { IDownloader } from '@src/shared/interfaces/downloader.interface';
import { YtdlpFileService } from './ytdlp/ytdlp-file.service';

const downloaderFactory = (
	configService: ConfigService,
	ytdlpFileService: YtdlpFileService,
	ytdlpStreamService: YtdlpStreamService
): IDownloader => {
	const type: DownloaderType = configService.getOrThrow('DOWNLOADER_TYPE');
	const strategy: DownloadStrategy = configService.getOrThrow('DOWNLOAD_STRATEGY');

	const config = `${type}:${strategy}`;

	switch (config) {
		case 'ytdlp:file':
			return ytdlpFileService;
		case 'ytdlp:stream':
			return ytdlpStreamService;
		default:
			throw new Error(`Unsupported configuration for downloading: ${config}`);
	}
};

@Module({
	imports: [YtdlpModule],
	providers: [
		{
			provide: IDownloaderToken,
			useFactory: downloaderFactory,
			inject: [ConfigService, YtdlpFileService, YtdlpStreamService]
		}
	],
	exports: [IDownloaderToken]
})
export class DownloaderModule {}
