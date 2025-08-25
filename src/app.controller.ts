import { Body, Controller, Get, Post, Query, Res, UseInterceptors } from '@nestjs/common';
import { PlatformFactory } from './modules/platform/platform.factory';
import { Info } from '@shared/types/info.type';
import { DownloadVideoRequestDto } from './dto/request/download-video-request.dto';
import { InfoDto } from './dto/response/info.dto';
import { type Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import sanitize from 'sanitize-filename';
import contentDisposition from 'content-disposition';
import { DownloaderInterceptor } from '@src/modules/downloader/downloader.interceptor';

@ApiTags('Videos')
@Controller('api')
export class AppController {
	constructor(private readonly platformFactory: PlatformFactory) {}

	@ApiOperation({ summary: 'Check API status' })
	@ApiResponse({
		status: 200,
		description: 'API is running',
		example: { message: 'I am up and running' }
	})
	@Get('/status')
	status(): { message: string } {
		return { message: 'I am up and running' };
	}

	@ApiOperation({ summary: 'Get video information' })
	@ApiQuery({
		name: 'link',
		description: 'URL of the video to get information for',
		required: true
	})
	@ApiResponse({
		status: 200,
		description: 'Video information retrieved successfully',
		type: InfoDto
	})
	@Get('/info')
	async getInfo(@Query('link') link: string): Promise<Info> {
		const platform = this.platformFactory.get(link);

		const info = await platform.getInfo(link);
		return info;
	}

	@ApiOperation({ summary: 'Download video' })
	@ApiBody({
		type: DownloadVideoRequestDto,
		description: 'Video download request parameters'
	})
	@ApiResponse({
		status: 201,
		description: 'Video file',
		content: {
			'application/octet-stream': {}
		}
	})
	@UseInterceptors(new DownloaderInterceptor())
	@Post('/download')
	async download(@Body() body: DownloadVideoRequestDto, @Res() response: Response): Promise<void> {
		const { link, formatId } = body;
		const platform = this.platformFactory.get(link);

		const { stream, fileExtension, title } = await platform.download(link, formatId);

		const filename = `${sanitize(title)}.${fileExtension}`;

		response.setHeader('Content-Type', 'application/octet-stream');
		response.setHeader('Content-Disposition', contentDisposition(filename));

		stream.pipe(response);
		return;
	}
}
