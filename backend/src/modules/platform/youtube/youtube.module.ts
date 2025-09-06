import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { DownloaderModule } from '../../downloader/downloader.module';
import { RedisModule } from '@src/infrastructure/redis/redis.module';

@Module({
	imports: [DownloaderModule, RedisModule],
	providers: [YoutubeService],
	exports: [YoutubeService]
})
export class YoutubeModule {}
