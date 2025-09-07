import { Readable } from 'stream';
import { Task } from './task.entity';
import { Format } from '@src/shared/types/format.type';

export type TaskCreateModel = {
	link: string;
	approximateSize: number;
	stream: Readable;
	format: Format;
	title: string;
}

export interface ITaskRepository {
	create(task: TaskCreateModel): Promise<Task>;
	update(task: Partial<Task>): Promise<Task | null>;
	delete(uuid: string): Promise<Task | null>;

	findById(uuid: string): Promise<Task | null>;
	findByLink(link: string): Promise<Task | null>;
}
