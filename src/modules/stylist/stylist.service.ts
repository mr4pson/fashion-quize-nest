import { ConflictException, Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Not, Repository } from 'typeorm';
import { User } from '../user/model/user.entity';
import { ChangeStylistDto } from './change-stylist.dto';
import * as bcrypt from 'bcrypt';
import { RoleType } from '../shared/enum/role-type.enum';
import { generateRandomString } from '../shared/utils/generate-random-string.utils';
import { MailService } from '../mail/mail.service'

@Injectable()
export class StylistService {
  private userRepository: Repository<User>;
  constructor(
    private connection: Connection,
    private mailService: MailService,
  ) {
    this.userRepository = this.connection.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder("user")
      .select(['user.id', 'user.name', 'user.login', 'user.createdAt', 'user.updatedAt', 'user.age', 'user.city'])
      .where("user.roles like :roles", { roles: `%STYLIST%` })
      .getMany();
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async create(stylistDto: ChangeStylistDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { login: stylistDto.login } });
    if (user) {
      throw new ConflictException('User already exist');
    }
    const password = generateRandomString(8);

    const stylist: User = {
      ...stylistDto,
      passwordHash: await bcrypt.hash(password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: [],
      roles: JSON.stringify([RoleType.STYLIST]),
    }

    await this.mailService.stylistRegistrationSuccessful(stylist, password);

    return this.userRepository.save(stylist);
  }

  async update(id: number, stylist: ChangeStylistDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { login: stylist.login, id: Not(id) } });
    if (user) {
      throw new ConflictException('User already exist');
    }

    const toUpdate = await this.userRepository.findOne(id);
    return this.userRepository.save({
      ...toUpdate,
      ...stylist,
      updatedAt: new Date(),
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
