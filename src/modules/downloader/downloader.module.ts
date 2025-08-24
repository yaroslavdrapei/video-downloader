import { Module } from '@nestjs/common';
import { YtdlpModule } from './ytdlp/ytdlp.module';
import { IDownloaderToken } from '@src/shared/constants/tokens';
import { YtdlpService } from './ytdlp/ytdlp.service';
import { ConfigService } from '@nestjs/config';
import { DownloaderType } from '@src/shared/constants/constants';
import { IDownloader } from '@src/shared/interfaces/downloader.interface';

const downloaderFactory = (configService: ConfigService, ytdlpService: YtdlpService): IDownloader => {
	const type: DownloaderType = configService.getOrThrow('DOWNLOADER_TYPE');

	switch (type) {
		case 'ytdlp':
			return ytdlpService;
		default:
			throw new Error('Wrong downloader type');
	}
};

@Module({
	imports: [YtdlpModule],
	providers: [
		{
			provide: IDownloaderToken,
			useFactory: downloaderFactory,
			inject: [ConfigService, YtdlpService]
		}
	],
	exports: [IDownloaderToken]
})
export class DownloaderModule {}
