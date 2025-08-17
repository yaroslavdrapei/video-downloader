import { Injectable } from '@nestjs/common';
import { IPlatform } from '@src/shared/interfaces/platform.interface';
import { Info } from '@src/shared/types/info.type';
import { Readable } from 'stream';

@Injectable()
export class YoutubeService implements IPlatform {
	getInfo(link: string): Promise<Info> {
		throw new Error('Method not implemented.');
	}

	download(link: string, formatId: string): Promise<Readable> {
		throw new Error('Method not implemented.');
	}
}
