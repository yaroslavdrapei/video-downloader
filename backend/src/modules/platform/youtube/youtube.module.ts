import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { DownloaderModule } from '../../downloader/downloader.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

@Module({
	imports: [DownloaderModule, InfrastructureModule],
	providers: [YoutubeService],
	exports: [YoutubeService]
})
export class YoutubeModule {}
