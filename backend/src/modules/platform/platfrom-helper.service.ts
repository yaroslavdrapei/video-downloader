import { Injectable } from '@nestjs/common';
import { RedisService } from '@src/infrastructure/redis/redis.service';
import { Task } from '@modules/task/task.entity';
import { TaskInMemoryRepository } from '@src/infrastructure/repositories/task/task-in-memory.repository';
import { UPDATE_FREQUENCY } from '@modules/task/task.constants';
import { TaskStatus } from '../task/task-status.enum';

// this is a helper service for other platform services

@Injectable()
export class PlatformHelperService {
	constructor(
		private readonly redisService: RedisService,
		private readonly taskRepository: TaskInMemoryRepository
	) {}

	setupStreamListeners(task: Task): void {
		let lastUpdate = Date.now();
		let totalDownloaded = task.downloaded;

		const stream = task.stream;

		stream.on('data', (chunk: Buffer) => {
			const now = Date.now();
			if (now - lastUpdate < UPDATE_FREQUENCY) return;

			totalDownloaded += chunk.length;

			void this.taskRepository.update({
				uuid: task.uuid,
				downloaded: totalDownloaded
			});

			lastUpdate = now;
		});

		stream.on('end', () => {
			void this.taskRepository.update({
				uuid: task.uuid,
				status: TaskStatus.READY_TO_SEND,
				approximateSize: totalDownloaded
			});
		});

		stream.on('error', () => {
			void this.taskRepository.update({
				uuid: task.uuid,
				status: TaskStatus.FAILED
			});
		});
	}
}
