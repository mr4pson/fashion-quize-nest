import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { User } from '../user/model/user.entity';
import { ChangeStylistDto } from './change-stylist.dto';
import * as bcrypt from 'bcrypt';
import { RoleType } from '../shared/enum/role-type.enum';
import { generateRandomString } from '../shared/utils/generate-random-string.utils';

@Injectable()
export class StylistService {
  private userRepository: Repository<User>;
  constructor(
    private connection: Connection
  ) {
    this.userRepository = this.connection.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder("user")
      .select(['user.id', 'user.name', 'user.login', 'user.createdAt', 'user.updatedAt'])
      .where("user.roles like :roles", { roles:`%STYLIST%` })
      .getMany();
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async create(stylistDto: ChangeStylistDto): Promise<User> {
    const stylist: User = {
      ...stylistDto,
      passwordHash: await bcrypt.hash(generateRandomString(8), 10),
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: [],
      roles: JSON.stringify([RoleType.STYLIST]),
    }

    // TODO send email to stylist user

    return this.userRepository.save(stylist);
  }

  async update(id: number, stylist: ChangeStylistDto): Promise<User> {
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
