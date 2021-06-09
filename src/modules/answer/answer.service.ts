import { Injectable } from "@nestjs/common";
import { Connection, Repository } from "typeorm";
import { User } from "../user/model/user.entity";
import { Answer } from "./answer.entity";
import { CreateAnswerDto } from "./create-answer.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AnswerService {
  private answerRepository: Repository<Answer>;
  private userRepository: Repository<User>;
  constructor(
    private connection: Connection
  ) {
    this.answerRepository = this.connection.getRepository(Answer);
    this.userRepository = this.connection.getRepository(User);
  }

  async findAll(): Promise<Answer[]> {
    return this.answerRepository.find();
  }

  async findById(id: number): Promise<Answer> {
    return this.answerRepository.findOne(id, { relations: ['user'] });
  }

  async create(answerData: CreateAnswerDto): Promise<Answer> {
    const userPayload: User = this.userRepository.create({
      login: answerData.email,
      name: answerData.name,
      passwordHash: await bcrypt.hash('secret', 10),
    });

    const user = await this.userRepository.save(userPayload);

    const answer = new Answer();
    answer.data = answerData.data;
    answer.user = user;

    return this.answerRepository.save(answer);
  }
}