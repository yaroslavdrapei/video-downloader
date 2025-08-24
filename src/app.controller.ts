import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { PlatformFactory } from './modules/platform/platform.factory';
import { Info } from '@shared/types/info.type';
import { DownloadVideoRequestDto } from './dto/request/download-video-request.dto';
import { type Response } from 'express';

@Controller('api')
export class AppController {
	constructor(private readonly platformFactory: PlatformFactory) {}
	@Get('/status')
	status(): { message: string } {
		return { message: 'I am up and running' };
	}

	@Get('/info')
	async getInfo(@Query('link') link: string): Promise<Info> {
		const platform = this.platformFactory.get(link);

		const info = await platform.getInfo(link);
		return info;
	}

	@Post('/download')
	download(@Body() body: DownloadVideoRequestDto, @Res() response: Response): void {
		const { link, formatId } = body;
		const platform = this.platformFactory.get(link);

		const file = platform.download(link, formatId);
		file.pipe(response);
		return;
	}
}
