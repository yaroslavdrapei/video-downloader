import { Readable } from 'stream';
import { Info } from '../../shared/types/info.type';

export type DownloadResult = { stream: Readable; fileExtension: 'mp4' | 'mp3'; title: string };

export interface IPlatform {
	getInfo(link: string): Promise<Info>;
	download(link: string, formatId: string): Promise<DownloadResult>;
}
