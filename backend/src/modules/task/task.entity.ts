import { Readable } from 'stream';
import { TaskStatus } from './task-status.enum';

export class Task {
	uuid: string;
	link: string;
	stream: Readable;
	status: TaskStatus;
	downloaded: number;
	approximateSize: number;
}
