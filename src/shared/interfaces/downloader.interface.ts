import { Readable } from 'stream';
import { Info } from '../types/info.type';

export interface IDownloader {
	getInfo(link: string): Promise<Info>;
	basicDownload(link: string, formatId: string): Promise<Readable>;
	mergeDownload(link: string, formatId: string, audioFormatId: string): Promise<Readable>;
}
