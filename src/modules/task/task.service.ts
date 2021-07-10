import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Not, Repository } from 'typeorm';
import { TaskStatuses } from '../shared/enum/task-statuses.enum';
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

  async findStylistTasks(stylistId): Promise<Task[]> {
    return this.taskRepository.find({ where: { stylist: stylistId } });
  }

  async findUserTasks(userId): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: userId } });
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
    task.stylist = await this.getMostFreeStylist();

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

  async getMostFreeStylist(): Promise<User> {
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
              .where('task.status != :status', { status: TaskStatuses.DONE })
              .groupBy('task.stylistId')
          }, 'task', 'task.stylistId = user.id')
          .where('user.roles = :role', { role: '["STYLIST"]' })
          .groupBy('user.id')
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
              .where('task.status != :status', { status: TaskStatuses.DONE })
              .groupBy('task.stylistId')
          }, 'task', 'task.stylistId = user.id')
          .where('user.roles = :role', { role: '["STYLIST"]' })
          .groupBy('user.id')
          .having('number = :maxNumber', { maxNumber: minNumberData.number });
      }, "t1")
      .getRawOne();

    return this.userRepository.findOne(freeStylistIdData.id);
  }
}
