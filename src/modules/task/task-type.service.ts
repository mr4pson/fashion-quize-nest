import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { ChangeTaskTypeDto } from './change-task-type.dto';
import { TaskType } from './task-type.entity';

@Injectable()
export class TaskTypeService {
  private taskTypeRepository: Repository<TaskType>;
  constructor(
    private connection: Connection
  ) {
    this.taskTypeRepository = this.connection.getRepository(TaskType);
  }

  async findAll(): Promise<TaskType[]> {
    return this.taskTypeRepository.find();
  }

  async findById(id: number): Promise<TaskType> {
    return this.taskTypeRepository.findOne(id);
  }

  async create(taskTypeData: ChangeTaskTypeDto): Promise<TaskType> {
    const taskType = new TaskType();

    taskType.title = taskTypeData.title;

    return this.taskTypeRepository.save(taskType);
  }

  async update(id: number, taskTypeData: ChangeTaskTypeDto): Promise<TaskType> {
    const taskType = await this.taskTypeRepository.findOne(id);

    taskType.title = taskTypeData.title;

    return this.taskTypeRepository.save(taskType);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.taskTypeRepository.delete(id);
  }
}
