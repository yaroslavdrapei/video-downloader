import { Module } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { DownloaderModule } from '../downloader/downloader.module';

@Module({
	imports: [DownloaderModule],
	providers: [TiktokService],
	exports: [TiktokService]
})
export class TiktokModule {}
