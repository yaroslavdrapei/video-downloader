import { Module } from '@nestjs/common';
import { TaskInMemoryRepository } from './task/task-in-memory.repository';

@Module({
	providers: [TaskInMemoryRepository],
	exports: [TaskInMemoryRepository]
})
export class RepositoriesModule {}
