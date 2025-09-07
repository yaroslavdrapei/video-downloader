/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { Task } from '@src/modules/task/task.entity';
import { ITaskRepository, TaskCreateModel } from '@src/modules/task/task.repository.interface';
import { TaskStatus } from '@src/modules/task/task-status.enum';

const tasks = new Map<string, Task>();

@Injectable()
export class TaskInMemoryRepository implements ITaskRepository {
	constructor() {}

	async create({ link, approximateSize, stream, format, title }: TaskCreateModel): Promise<Task> {
		const uuid = crypto.randomUUID();
		const task: Task = {
			uuid,
			link,
			stream,
			status: TaskStatus.DOWNLOADING,
			downloaded: 0,
			format,
			approximateSize,
			title
		};
		tasks.set(uuid, task);
		return task;
	}

	async update(task: Partial<Task>): Promise<Task | null> {
		if (!task.uuid) return null;

		const existing = tasks.get(task.uuid);
		if (!existing) return null;

		const updated: Task = {
			...existing,
			stream: task.stream ?? existing.stream,
			status: task.status ?? existing.status,
			downloaded: task.downloaded ?? existing.downloaded,
			approximateSize: task.approximateSize ?? existing.approximateSize
		};

		tasks.set(task.uuid, updated);
		return updated;
	}

	async delete(uuid: string): Promise<Task | null> {
		const task = tasks.get(uuid) || null;
		if (task) tasks.delete(uuid);
		return task;
	}

	async findById(uuid: string): Promise<Task | null> {
		return tasks.get(uuid) || null;
	}

	async findByLink(link: string): Promise<Task | null> {
		for (const task of tasks.values()) {
			if (task.link === link) return task;
		}
		return null;
	}
}
