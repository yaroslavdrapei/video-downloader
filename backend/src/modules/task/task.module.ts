import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { RepositoriesModule } from '@src/infrastructure/repositories/repositories.module';

@Module({
	imports: [RepositoriesModule],
	providers: [TaskService],
	exports: [TaskService]
})
export class TaskModule {}
