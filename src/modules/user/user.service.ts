import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Task } from '../task/task.entity';
import { User } from './model/user.entity';

@Injectable()
export class UserService {
  private userRepository: Repository<User>;
  private taskRepository: Repository<Task>;

  constructor(
    private connection: Connection,
  ) {
    this.userRepository = this.connection.getRepository(User);
    this.taskRepository = this.connection.getRepository(Task);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { roles: "[\"USER\"]" } });
  }

  async findStylistUsers(id: number): Promise<User[]> {
    const tasks = await this.taskRepository.find({ where: { stylist: id }, relations: ['user'] });

    const users = [];
    tasks.forEach(task => {
      if (!users.find(user => task.user.id === user.id)) {
        users.push(task.user);
      }
    });
    return users;
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect("user.tasks", "task")
      .leftJoinAndSelect("user.answers", "answers")
      .leftJoinAndSelect("task.status", "status")
      .leftJoinAndSelect("task.type", "type")
      .where("user.id = :id", { id })
      .getOne();
  }
}
