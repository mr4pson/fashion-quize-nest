import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { ChangeTaskStatusDto } from './change-task-status.dto';
import { TaskStatus } from './task-status.entity';

@Injectable()
export class TaskStatusService {
  private taskStatusRepository: Repository<TaskStatus>;
  constructor(
    private connection: Connection
  ) {
    this.taskStatusRepository = this.connection.getRepository(TaskStatus);
  }

  async findAll(): Promise<TaskStatus[]> {
    return this.taskStatusRepository.find();
  }

  async findById(id: number): Promise<TaskStatus> {
    return this.taskStatusRepository.findOne(id);
  }

  async create(taskStatusData: ChangeTaskStatusDto): Promise<TaskStatus> {
    const taskStatus = new TaskStatus();

    taskStatus.title = taskStatusData.title;

    return this.taskStatusRepository.save(taskStatus);
  }

  async update(id: number, taskStatusData: ChangeTaskStatusDto): Promise<TaskStatus> {
    const taskStatus = await this.taskStatusRepository.findOne(id);

    taskStatus.title = taskStatusData.title;

    return this.taskStatusRepository.save(taskStatus);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.taskStatusRepository.delete(id);
  }
}
