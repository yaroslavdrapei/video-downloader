import { ApiProperty } from '@nestjs/swagger';

export class TaskUuidResponseDto {
	@ApiProperty({
		description: 'Unique identifier for the download task',
		example: 'c7b8e2a2-4e2b-4c8e-9e2a-2b4e2b4c8e9e',
		type: String
	})
	uuid: string;
}
