import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { User } from '../user/model/user.entity';
import { ChangeTaskDto } from './change-task.dto';
import { TaskStatus } from './task-status.entity';
import { TaskType } from './task-type.entity';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  private taskRepository: Repository<Task>;
  private userRepository: Repository<User>;
  private taskStatusRepository: Repository<TaskStatus>;
  private taskTypeRepository: Repository<TaskType>;
  constructor(
    private connection: Connection
  ) {
    this.taskRepository = this.connection.getRepository(Task);
    this.userRepository = this.connection.getRepository(User);
    this.taskStatusRepository = this.connection.getRepository(TaskStatus);
    this.taskTypeRepository = this.connection.getRepository(TaskType);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['status', 'type'] });
  }

  async findStylistTasks(stylistId: number): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['status', 'type'], where: { stylist: stylistId } });
  }

  async findUserTasks(userId: number): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['status', 'type'], where: { user: userId } });
  }

  async findById(id: number): Promise<Task> {
    return this.taskRepository.findOne(id, { relations: ['user', 'status', 'type'] });
  }

  async create(userId: number, taskData: ChangeTaskDto): Promise<Task> {
    const user = await this.userRepository.findOne(userId);
    const status = await this.taskStatusRepository.findOne({ where: { title: 'Новая' } });
    const type = await this.taskTypeRepository.findOne(taskData.type);

    const task = new Task();
    task.comment = taskData.comment;
    task.date = taskData.date;
    task.status = status;
    task.type = type;
    task.user = user;
    task.createdAt = new Date();
    task.updatedAt = new Date();
    task.stylist = await this.getMostFreeStylist();

    return this.taskRepository.save(task);
  }

  async update(id: number, taskData: ChangeTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    const status = await this.taskStatusRepository.findOne(taskData.status);
    const type = await this.taskTypeRepository.findOne(taskData.type);

    task.comment = taskData.comment;
    task.date = taskData.date;
    task.status = status;
    task.type = type;
    task.updatedAt = new Date();

    return this.taskRepository.save(task);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.taskRepository.delete(id);
  }

  async getMostFreeStylist(): Promise<User> {
    const statusDoneId = 3;
  
    const minNumberData = await this.connection
      .createQueryBuilder()
      .select(["MIN(t.number) as number"])
      .from(subQuery => {
        return subQuery
          .select(['user.id', 'coalesce(num, 0) number'])
          .from(User, 'user')
          .leftJoinAndSelect((subQuery1) => {
            return subQuery1
              .select(['count(id) as num', 'task.stylistId'])
              .from(Task, 'task')
              .where('task.status != :statusId', { statusId: statusDoneId })
              .groupBy('task.stylistId')
          }, 'task', 'task.stylistId = user.id')
          .where('user.roles = :role', { role: '["STYLIST"]' })
          .groupBy('user.id')
          .addGroupBy('task.num')
      }, "t")
      .getRawOne();

    const freeStylistIdData = await this.connection
      .createQueryBuilder()
      .select(["id"])
      .from(subQuery1 => {
        return subQuery1
          .select(['user.id as id', 'coalesce(num, 0) number'])
          .from(User, 'user')
          .leftJoinAndSelect((subQuery) => {
            return subQuery
              .select(['count(id) as num', 'task.stylistId'])
              .from(Task, 'task')
              .where('task.status != :statusId', { statusId: statusDoneId })
              .groupBy('task.stylistId')
          }, 'task', 'task.stylistId = user.id')
          .where('user.roles = :role', { role: '["STYLIST"]' })
          .groupBy('user.id')
          .addGroupBy('task.num')
          .having('number = :maxNumber', { maxNumber: minNumberData.number });
      }, "t1")
      .getRawOne();

    return this.userRepository.findOne(freeStylistIdData.id);
  }
}
