import { Module } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { DownloaderModule } from '../../downloader/downloader.module';
import { RedisModule } from '@src/infrastructure/redis/redis.module';

@Module({
	imports: [DownloaderModule, RedisModule],
	providers: [TiktokService],
	exports: [TiktokService]
})
export class TiktokModule {}
