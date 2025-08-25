import { Module } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { DownloaderModule } from '../../downloader/downloader.module';
import { InfrastructureModule } from '@src/infrastructure/infrastructure.module';

@Module({
	imports: [DownloaderModule, InfrastructureModule],
	providers: [TiktokService],
	exports: [TiktokService]
})
export class TiktokModule {}
