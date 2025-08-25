import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DownloadVideoRequestDto {
	@ApiProperty({
		description: 'The URL of the video to download',
		example: 'https://www.youtube.com/watch?v=sample123',
		type: String
	})
	@IsString()
	@IsUrl()
	link: string;

	@ApiProperty({
		description: 'The format ID for the video download',
		example: '137',
		type: String
	})
	@IsString()
	formatId: string;
}
