import { Module } from '@nestjs/common';
import { Mapper } from './mapper';

@Module({
	providers: [Mapper],
	exports: [Mapper]
})
export class MapperModule {}
