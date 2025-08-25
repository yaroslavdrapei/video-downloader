import { Injectable } from '@nestjs/common';
import { Format } from '@src/shared/types/format.type';
import { Info } from '@src/shared/types/info.type';
import { YtdlpInfo, YtdlpFormat } from '../../modules/downloader/ytdlp/ytdlp.types';

@Injectable()
export class Mapper {
	mapYtdlpFormats(formats: YtdlpFormat[]): Format[] {
		return formats.map((format) => ({
			vcodec: format.vcodec,
			acodec: format.acodec,
			id: format.format_id,
			ext: format.ext,
			resolution: format.resolution,
			filesize: format.filesize || 0
		}));
	}

	mapYtdlpInfo(info: YtdlpInfo): Info {
		return {
			link: info.url,
			title: info.title,
			thumbnailUrl: info.thumbnail,
			formats: this.mapYtdlpFormats(info.formats)
		};
	}
}
