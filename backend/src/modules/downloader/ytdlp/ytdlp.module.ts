import { Module } from '@nestjs/common';
import { YtdlpStreamService } from './ytdlp-stream.service';
import { MapperModule } from '@src/shared/mapper/mapper.module';
import { YtdlpFileService } from './ytdlp-file.service';

@Module({
	imports: [MapperModule],
	providers: [YtdlpStreamService, YtdlpFileService],
	exports: [YtdlpStreamService, YtdlpFileService]
})
export class YtdlpModule {}
