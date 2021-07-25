import { Injectable } from "@nestjs/common";
import { Connection, Repository } from "typeorm";
import { User } from "../user/model/user.entity";
import { Answer } from "./answer.entity";

@Injectable()
export class AnswerService {
  private answerRepository: Repository<Answer>;
  constructor(
    private connection: Connection
  ) {
    this.answerRepository = this.connection.getRepository(Answer);
  }

  async findAll(): Promise<Answer[]> {
    return this.answerRepository.find();
  }

  async findById(id: number): Promise<Answer> {
    return this.answerRepository.findOne(id, { relations: ['user'] });
  }
}