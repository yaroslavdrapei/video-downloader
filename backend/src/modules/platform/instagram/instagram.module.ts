import { Module } from '@nestjs/common';
import { InstagramService } from './instagram.service';
import { DownloaderModule } from '../../downloader/downloader.module';
import { RedisModule } from '@src/infrastructure/redis/redis.module';

@Module({
	imports: [DownloaderModule, RedisModule],
	providers: [InstagramService],
	exports: [InstagramService]
})
export class InstagramModule {}
