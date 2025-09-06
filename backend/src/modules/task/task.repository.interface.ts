import { Task } from './task.entity';

export interface ITaskRepository {
	create(link: string, approximateSize: number): Promise<Task>;
	update(task: Partial<Task>): Promise<Task | null>;
	delete(uuid: string): Promise<Task | null>;

	findById(uuid: string): Promise<Task | null>;
	findByLink(link: string): Promise<Task | null>;
}
