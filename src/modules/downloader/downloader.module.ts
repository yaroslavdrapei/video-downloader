import { Module } from '@nestjs/common';
import { YtdlpModule } from './ytdlp/ytdlp.module';
import { YtdlpStreamService } from './ytdlp/ytdlp-stream.service';
import { ConfigService } from '@nestjs/config';
import { IDownloader } from '@src/modules/downloader/downloader.interface';
import { YtdlpFileService } from './ytdlp/ytdlp-file.service';
import { DownloaderType, DownloadStrategy } from './downloader.enums';
import { IDownloaderToken } from './downloader.constants';

const downloaderFactory = (
	configService: ConfigService,
	ytdlpFileService: YtdlpFileService,
	ytdlpStreamService: YtdlpStreamService
): IDownloader => {
	const type = configService.getOrThrow<DownloaderType>('DOWNLOADER_TYPE');
	const strategy = configService.getOrThrow<DownloadStrategy>('DOWNLOAD_STRATEGY');

	const downloaderMap: Record<string, IDownloader> = {
		[`${DownloaderType.YTDLP}:${DownloadStrategy.FILE}`]: ytdlpFileService,
		[`${DownloaderType.YTDLP}:${DownloadStrategy.STREAM}`]: ytdlpStreamService
	};

	const config = `${type}:${strategy}`;
	const downloader = downloaderMap[config];

	if (!downloader) {
		throw new Error(`Unsupported configuration for downloading: ${config}`);
	}

	return downloader;
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
