import { Readable } from 'stream';
import { Task } from './task.entity';

export type TaskCreateModel = {
	link: string;
	approximateSize: number;
	stream: Readable;
}

export interface ITaskRepository {
	create(task: TaskCreateModel): Promise<Task>;
	update(task: Partial<Task>): Promise<Task | null>;
	delete(uuid: string): Promise<Task | null>;

	findById(uuid: string): Promise<Task | null>;
	findByLink(link: string): Promise<Task | null>;
}
