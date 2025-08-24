import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { DownloaderModule } from '../downloader/downloader.module';

@Module({
	imports: [DownloaderModule],
	providers: [YoutubeService],
	exports: [YoutubeService]
})
export class YoutubeModule {}
