import { Module } from '@nestjs/common';
import { YtdlpService } from './ytdlp.service';
import { MapperModule } from '@src/shared/mapper/mapper.module';

@Module({
	imports: [MapperModule],
	providers: [YtdlpService],
	exports: [YtdlpService]
})

export class YtdlpModule {}
