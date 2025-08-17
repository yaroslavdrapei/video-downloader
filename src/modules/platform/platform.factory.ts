import { BadRequestException, Injectable } from '@nestjs/common';
import { YoutubeService } from '../youtube/youtube.service';
import { IPlatform } from '@src/shared/interfaces/platform.interface';
import { TiktokService } from '../tiktok/tiktok.service';
import { InstagramService } from '../instagram/instagram.service';

@Injectable()
export class PlatformFactory {
	constructor(
		private readonly youtubeService: YoutubeService,
		private readonly tiktokService: TiktokService,
		private readonly instagramService: InstagramService
	) {}

	get(link: string): IPlatform {
		if (link.includes('youtube.com') || link.includes('youtu.be')) {
			return this.youtubeService;
		} else if (link.includes('tiktok.com')) {
			return this.tiktokService;
		} else if (link.includes('instagram.com')) {
			return this.instagramService;
		} else {
			throw new BadRequestException('Unsupported platform');
		}
	}
}
