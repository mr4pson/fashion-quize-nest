import { ConflictException, Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { TaskStatus } from '../task/task-status.entity';
import { Task } from '../task/task.entity';
import { CreateCompilationDto } from './create-compilation.dto';
import { Compilation } from './compilation.entity';
import { LookItem } from './look-item.entity';
import { Look } from './look.entity';
import { UpdateCompilationDto } from './update-compilation.dto';
import { MailService } from '../mail/mail.service';
import { RateCompilationDto } from './rate-compilation.dto';

@Injectable()
export class CompilationService {
  private compilationRepository: Repository<Compilation>;
  private taskRepository: Repository<Task>;
  private lookRepository: Repository<Look>;
  private lookItemRepository: Repository<LookItem>;
  private taskStatusRepository: Repository<TaskStatus>;

  constructor(
    private connection: Connection,
    private mailService: MailService,
  ) {
    this.compilationRepository = this.connection.getRepository(Compilation);
    this.taskRepository = this.connection.getRepository(Task);
    this.lookRepository = this.connection.getRepository(Look);
    this.lookItemRepository = this.connection.getRepository(LookItem);
    this.taskStatusRepository = this.connection.getRepository(TaskStatus);
  }

  async findAll(): Promise<Compilation[]> {
    return this.compilationRepository.createQueryBuilder("compilation")
      .innerJoinAndSelect("compilation.task", "task")
      .leftJoinAndSelect("compilation.looks", "look")
      .leftJoinAndSelect("look.items", "lookItem")
      .innerJoinAndSelect("task.user", "user")
      .innerJoinAndSelect("task.status", "status")
      .getMany();
  }

  async findUserCompilations(id: number): Promise<Compilation[]> {
    return this.compilationRepository.createQueryBuilder("compilation")
      .innerJoinAndSelect("compilation.task", "task")
      .leftJoinAndSelect("compilation.looks", "look")
      .leftJoinAndSelect("look.items", "lookItem")
      .innerJoinAndSelect("task.user", "user")
      .innerJoinAndSelect("task.status", "status")
      .where("user.id = :id", { id })
      .getMany();
  }

  async findStylistCompilations(id: number): Promise<Compilation[]> {
    return this.compilationRepository.createQueryBuilder("compilation")
      .innerJoinAndSelect("compilation.task", "task")
      .leftJoinAndSelect("compilation.looks", "look")
      .leftJoinAndSelect("look.items", "lookItem")
      .innerJoinAndSelect("task.user", "user")
      .innerJoinAndSelect("task.status", "status")
      .where("task.stylist = :id", { id })
      .getMany();
  }

  async findById(id: number): Promise<Compilation> {
    return this.compilationRepository.createQueryBuilder("compilation")
      .innerJoinAndSelect("compilation.task", "task")
      .leftJoinAndSelect("compilation.looks", "look")
      .leftJoinAndSelect("look.items", "lookItem")
      .innerJoinAndSelect("task.user", "user")
      .innerJoinAndSelect("task.status", "status")
      .where("compilation.id = :id", { id })
      .getOne();
  }

  async create(compilationData: CreateCompilationDto): Promise<Compilation> {
    const task = await this.taskRepository.findOne(compilationData.taskId, { relations: ['compilation', 'user'] });

    if (task.compilation) {
      throw new ConflictException('Compilation was already assigned to that task.');
    }

    const status = await this.taskStatusRepository.findOne(compilationData.status);

    task.status = status;

    await this.taskRepository.save(task);

    const compilationObj = new Compilation();
    compilationObj.task = task;
    compilationObj.createdAt = new Date();
    compilationObj.updatedAt = new Date();

    const compilation = await this.compilationRepository.save(compilationObj);

    const looks: Look[] = JSON.parse(compilationData.looks);

    looks.forEach(async (look) => {
      const lookObj = new Look();
      lookObj.compilation = compilation;
      const lookInst = await this.lookRepository.save(lookObj);
      look.items.forEach(async (item) => {
        const lookItemObj = new LookItem();
        lookItemObj.name = item.name;
        lookItemObj.photo = item.photo;
        lookItemObj.look = lookInst;
        await this.lookItemRepository.save(lookItemObj);
      });
    });

    await this.mailService.compilationCreated(task.user);

    compilation.task = task;

    return this.compilationRepository.save(compilation);
  }

  async rate(compilationData: RateCompilationDto) {
    const task = await this.taskRepository.findOne({ where: { id: compilationData.taskId }, relations: ['compilation'] });

    const completedTaskStatus = await this.taskStatusRepository.findOne({ where: { title: 'Подтверждена пользователем' } });
    task.status = completedTaskStatus;
    await this.taskRepository.save(task);

    const looks = JSON.parse(compilationData.looks);
    const promises = [];
    looks.forEach(async (lookObj) => {
      const look = await this.lookRepository.findOne(lookObj.id);
      look.selected = lookObj.selected;

      promises.push(this.lookRepository.save(lookObj));
    });

    const compilation = await this.compilationRepository.findOne(task.compilation);
    compilation.task = task;
    await this.compilationRepository.save(compilation);

    return await Promise.all(promises);
  }

  async update(id, compilationData: UpdateCompilationDto): Promise<Compilation> {
    const compilation = await this.compilationRepository.createQueryBuilder("compilation")
      .innerJoinAndSelect("compilation.task", "task")
      .leftJoinAndSelect("compilation.looks", "look")
      .leftJoinAndSelect("look.items", "lookItem")
      .innerJoinAndSelect("task.user", "user")
      .innerJoinAndSelect("task.status", "status")
      .where("compilation.id = :id", { id })
      .getOne();

    const status = await this.taskStatusRepository.findOne(compilationData.status);

    compilation.task.status = status;

    await this.taskRepository.save(compilation.task);

    compilation.updatedAt = new Date();

    const looks: Look[] = JSON.parse(compilationData.looks);

    compilation.looks.forEach((look, lookIndex) => {
      const missingItems = look.items.filter(item => !looks[lookIndex].items.find(curItem => curItem.id === item.id));
      missingItems.forEach(item => {
        this.lookItemRepository.remove(item);
      });
    });

    looks.forEach(async (look, lookIndex) => {
      look.items.forEach(async (item) => {
        if (!item.id) {
          const lookItemObj = new LookItem();
          lookItemObj.name = item.name;
          lookItemObj.photo = item.photo;
          lookItemObj.look = look;
          compilation.looks[lookIndex].items.push(lookItemObj);
        }
      });
    });

    compilation.looks = looks;

    await this.mailService.compilationCreated(compilation.task.user);

    return this.compilationRepository.save(compilation);
  }

  async delete(id: number): Promise<DeleteResult> {
    const task = await this.taskRepository.findOne({ where: { compilation: id } });
    task.compilation = null;

    await this.taskRepository.save(task);

    return await this.compilationRepository.delete(id);
  }
}
