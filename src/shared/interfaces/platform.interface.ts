import { Readable } from 'stream';
import { Info } from '../types/info.type';

export interface IPlatform {
	getInfo(link: string): Promise<Info>;
	download(link: string, formatId: string): Readable;
}
