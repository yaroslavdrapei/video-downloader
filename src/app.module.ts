import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ConfigModule } from '@nestjs/config';
import { PlatformModule } from './modules/platform/platform.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true,
			envFilePath: ['.env', '.env.development']
		}),
		InfrastructureModule,
		PlatformModule
	],
	controllers: [AppController]
})
export class AppModule {}
