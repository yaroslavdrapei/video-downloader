import { Module } from '@nestjs/common';
import { PlatformFactory } from './platform.factory';
import { YoutubeModule } from './youtube/youtube.module';
import { TiktokModule } from './tiktok/tiktok.module';
import { InstagramModule } from './instagram/instagram.module';
import { RepositoriesModule } from '@src/infrastructure/repositories/repositories.module';
import { PlatformHelperService } from './platfrom-helper.service';
import { RedisModule } from '@src/infrastructure/redis/redis.module';

@Module({
	imports: [YoutubeModule, TiktokModule, InstagramModule, RepositoriesModule, RedisModule],
	providers: [PlatformFactory, PlatformHelperService],
	exports: [PlatformFactory, PlatformHelperService]
})
export class PlatformModule {}
