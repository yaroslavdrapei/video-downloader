import { ApiProperty } from '@nestjs/swagger';
import { FormatDto } from './format.dto';

export class InfoDto {
	@ApiProperty({
		description: 'Title of the video',
		example: 'Sample Video Title',
		type: String
	})
	title: string;

	@ApiProperty({
		description: 'Original URL of the video',
		example: 'https://www.youtube.com/watch?v=sample123',
		type: String
	})
	link: string;

	@ApiProperty({
		description: 'Available download formats',
		type: [FormatDto],
		isArray: true,
		example: [
			{
				id: '137',
				ext: 'mp4',
				filesize: 52428800,
				resolution: '1920x1080',
				vcodec: 'h264',
				acodec: 'none'
			},
			{
				id: '140',
				ext: 'mp3',
				filesize: 10485760,
				resolution: 'audio only',
				vcodec: 'none',
				acodec: 'aac'
			}
		]
	})
	formats: FormatDto[];

	@ApiProperty({
		description: 'Thumbnail URL of the video',
		example: 'https://example.com/thumbnail.jpg',
		type: String,
		required: false
	})
	thumbnailUrl?: string;
}
