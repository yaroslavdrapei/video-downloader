import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { PlatformFactory } from './modules/platform/platform.factory';
import { Info } from '@shared/types/info.type';
import { DownloadVideoRequestDto } from './dto/request/download-video-request.dto';
import { InfoDto } from './dto/response/info.dto';
import { type Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('videos')
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
	@Post('/download')
	download(@Body() body: DownloadVideoRequestDto, @Res() response: Response): void {
		const { link, formatId } = body;
		const platform = this.platformFactory.get(link);

		const file = platform.download(link, formatId);

		response.setHeader('Content-Type', 'application/octet-stream');
		file.pipe(response);
		return;
	}
}
