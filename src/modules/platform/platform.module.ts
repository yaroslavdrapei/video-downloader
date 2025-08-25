import { Module } from '@nestjs/common';
import { PlatformFactory } from './platform.factory';
import { YoutubeModule } from './youtube/youtube.module';
import { TiktokModule } from './tiktok/tiktok.module';
import { InstagramModule } from './instagram/instagram.module';

@Module({
	imports: [YoutubeModule, TiktokModule, InstagramModule],
	providers: [PlatformFactory],
	exports: [PlatformFactory]
})
export class PlatformModule {}
