import { ApiProperty } from '@nestjs/swagger';

export class FormatDto {
	@ApiProperty({
		description: 'Unique identifier for the format',
		example: 'best',
		type: String
	})
	id: string;

	@ApiProperty({
		description: 'File extension',
		example: 'mp4',
		type: String
	})
	ext: string;

	@ApiProperty({
		description: 'File size in bytes',
		example: 52428800,
		type: Number
	})
	filesize: number;

	@ApiProperty({
		description: 'Video resolution',
		example: '1920x1080',
		type: String,
		nullable: true,
		required: false
	})
	resolution?: string | null;

	@ApiProperty({
		description: 'Video codec',
		example: 'h264',
		type: String,
		nullable: true,
		required: false
	})
	vcodec: string | null;

	@ApiProperty({
		description: 'Audio codec',
		example: 'aac',
		type: String,
		nullable: true,
		required: false
	})
	acodec: string | null;
}
