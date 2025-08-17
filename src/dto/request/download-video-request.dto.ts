import { IsString, IsUrl } from 'class-validator';

export class DownloadVideoRequestDto {
	@IsString()
	@IsUrl()
	link: string;

	@IsString()
	formatId: string;
}
