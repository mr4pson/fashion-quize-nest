import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { User } from '../user/model/user.entity';
import { ChangeTaskDto } from './change-task.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  private taskRepository: Repository<Task>;
  private userRepository: Repository<User>;
  constructor(
    private connection: Connection
  ) {
    this.taskRepository = this.connection.getRepository(Task);
    this.userRepository = this.connection.getRepository(User);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findById(id: number): Promise<Task> {
    return this.taskRepository.findOne(id, { relations: ['user'] });
  }

  async create(userId: number, taskData: ChangeTaskDto): Promise<Task> {
    const user = await this.userRepository.findOne(userId);

    const task = new Task();
    task.comment = taskData.comment;
    task.date = taskData.date;
    task.status = taskData.status;
    task.type = taskData.type;
    task.user = user;

    return this.taskRepository.save(task);
  }

  async update(id: number, taskData: ChangeTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    task.comment = taskData.comment;
    task.date = taskData.date;
    task.status = taskData.status;
    task.type = taskData.type;

    return this.taskRepository.save(task);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.taskRepository.delete(id);
  }
}
