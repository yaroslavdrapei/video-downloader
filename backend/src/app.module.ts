import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PlatformModule } from './modules/platform/platform.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { YoutubeModule } from './modules/platform/youtube/youtube.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true,
			envFilePath: ['.env', '.env.development']
		}),
		RedisModule,
		PlatformModule,
		YoutubeModule
	],
	controllers: [AppController]
})
export class AppModule {}
