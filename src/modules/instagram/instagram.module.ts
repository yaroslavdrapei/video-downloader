import { Module } from '@nestjs/common';
import { InstagramService } from './instagram.service';
import { DownloaderModule } from '../downloader/downloader.module';
import { InfrastructureModule } from '@src/infrastructure/infrastructure.module';

@Module({
	imports: [DownloaderModule, InfrastructureModule],
	providers: [InstagramService],
	exports: [InstagramService]
})
export class InstagramModule {}
