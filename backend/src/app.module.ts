import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PlatformModule } from './modules/platform/platform.module';
import { RedisModule } from './infrastructure/redis/redis.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true,
			envFilePath: ['.env', '.env.development']
		}),
		RedisModule,
		PlatformModule
	],
	controllers: [AppController]
})
export class AppModule {}
