import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskStatusController } from './task-status.controller';
import { TaskStatusService } from './task-status.service';
import { TaskTypeController } from './task-type.controller';
import { TaskTypeService } from './task-type.service';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [
    TaskController,
    TaskStatusController,
    TaskTypeController,
  ],
  providers: [
    TaskService,
    TaskStatusService,
    TaskTypeService,
  ],
})
export class TaskModule { }
