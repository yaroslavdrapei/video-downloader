import { Module } from '@nestjs/common';
import { YtdlpService } from './ytdlp.service';
import { YtdlpCliService } from './ytdlp-cli.service';

@Module({
	providers: [YtdlpService, YtdlpCliService],
	exports: [YtdlpService]
})
export class YtdlpModule {}
