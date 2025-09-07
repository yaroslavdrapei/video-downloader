import { Module } from '@nestjs/common';
import { PlatformFactory } from './platform.factory';
import { YoutubeModule } from './youtube/youtube.module';
import { TiktokModule } from './tiktok/tiktok.module';
import { InstagramModule } from './instagram/instagram.module';
import { RepositoriesModule } from '@src/infrastructure/repositories/repositories.module';

@Module({
	imports: [YoutubeModule, TiktokModule, InstagramModule, RepositoriesModule],
	providers: [PlatformFactory],
	exports: [PlatformFactory]
})
export class PlatformModule {}
