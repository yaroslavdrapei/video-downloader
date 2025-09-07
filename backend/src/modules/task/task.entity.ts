import { Readable } from 'stream';
import { TaskStatus } from './task-status.enum';
import { Format } from '@src/shared/types/format.type';

export class Task {
	uuid: string;
	link: string;
	stream: Readable;
	status: TaskStatus;
	downloaded: number;
	approximateSize: number;
	format: Format;
	title: string;
}
