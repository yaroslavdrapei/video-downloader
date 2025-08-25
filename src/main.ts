import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true
		})
	);

	const config = new DocumentBuilder()
		.setTitle('Video Downloader API')
		.setDescription('API for downloading videos from various platforms')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	app.getHttpAdapter().get('/api/docs/json', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.send(document);
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
