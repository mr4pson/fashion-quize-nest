import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { Task } from '../task/task.entity';
import { CreateCompilationDto } from './change-compilation.dto';
import { Compilation } from './compilation.entity';
import { LookItem } from './look-item.entity';
import { Look } from './look.entity';
import { UpdateCompilationDto } from './update-compilation.dto';

@Injectable()
export class CompilationService {
  private compilationRepository: Repository<Compilation>;
  private taskRepository: Repository<Task>;
  private lookRepository: Repository<Look>;
  private lookItemRepository: Repository<LookItem>;
  constructor(
    private connection: Connection,
  ) {
    this.compilationRepository = this.connection.getRepository(Compilation);
    this.taskRepository = this.connection.getRepository(Task);
    this.lookRepository = this.connection.getRepository(Look);
    this.lookItemRepository = this.connection.getRepository(LookItem);
  }

  async findAll(): Promise<Compilation[]> {
    return this.compilationRepository.createQueryBuilder("compilation")
      .innerJoinAndSelect("compilation.task", "task")
      .innerJoinAndSelect("compilation.looks", "look")
      .innerJoinAndSelect("look.items", "lookItem")
      .innerJoinAndSelect("task.user", "user")
      .innerJoinAndSelect("task.status", "status")
      .getMany();
  }

  async findById(id: number): Promise<Compilation> {
    return this.compilationRepository.createQueryBuilder("compilation")
      .innerJoinAndSelect("compilation.task", "task")
      .innerJoinAndSelect("compilation.looks", "look")
      .innerJoinAndSelect("look.items", "lookItem")
      .innerJoinAndSelect("task.user", "user")
      .innerJoinAndSelect("task.status", "status")
      .where("compilation.id = :id", { id })
      .getOne();
  }

  async create(compilationData: CreateCompilationDto): Promise<Compilation> {
    const task = await this.taskRepository.findOne(compilationData.taskId);

    const compilationObj = new Compilation();
    compilationObj.task = task;
    const compilation = await this.compilationRepository.save(compilationObj);

    const looks: LookItem[][] = JSON.parse(compilationData.looks);
    looks.forEach(async (items) => {
      const lookObj = new Look();
      lookObj.compilation = compilation;
      const look = await this.lookRepository.save(lookObj);
      items.forEach(async (item) => {
        const lookItemObj = new LookItem();
        lookItemObj.name = item.name;
        lookItemObj.photo = item.photo;
        lookItemObj.look = look;
        await this.lookItemRepository.save(lookItemObj);
      });
    });

    return this.compilationRepository.save(compilation);
  }

  async update(id, compilationData: UpdateCompilationDto): Promise<Compilation> {
    const compilation = await this.compilationRepository.findOne(id);

    const looks: Look[] = JSON.parse(compilationData.looks);
    looks.forEach(async (look) => {
      look.items.forEach(async (item) => {
        if (!item.id) {
          const lookItemObj = new LookItem();
          lookItemObj.name = item.name;
          lookItemObj.photo = item.photo;
          lookItemObj.look = look;
          await this.lookItemRepository.save(lookItemObj);
        }
      });
    });

    return this.compilationRepository.save(compilation);
  }

  async delete(id: number): Promise<DeleteResult> {
    const task = await this.taskRepository.findOne({ where: { compilation: id } });
    task.compilation = null;
    await this.taskRepository.save(task);

    return await this.compilationRepository.delete(id);
  }
}
