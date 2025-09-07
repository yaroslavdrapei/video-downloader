import { forwardRef, Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { DownloaderModule } from '../../downloader/downloader.module';
import { RepositoriesModule } from '@src/infrastructure/repositories/repositories.module';
import { PlatformModule } from '../platform.module';

@Module({
	imports: [DownloaderModule, RepositoriesModule, forwardRef(() => PlatformModule)],
	providers: [YoutubeService],
	exports: [YoutubeService]
})
export class YoutubeModule {}
