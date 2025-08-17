import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true,
			envFilePath: ['.env', '.env.development']
		}),
		InfrastructureModule
	],
	controllers: [AppController]
})
export class AppModule {}
