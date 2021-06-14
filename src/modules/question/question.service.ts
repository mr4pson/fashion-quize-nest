import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { Block } from '../block/block.entity';
import { ChangeQuestionDto } from './change-question.dto';
import { Question } from './question.entity';
import { QuizeTypes } from './types';

@Injectable()
export class QuestionService {
  private questionRepository: Repository<Question>;
  private blockRepository: Repository<Block>;
  constructor(
    private connection: Connection
  ) {
    this.questionRepository = this.connection.getRepository(Question);
    this.blockRepository = this.connection.getRepository(Block);
  }

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ['block'] });
  }

  async findByQuizeType(quizeType: QuizeTypes) {
    return this.questionRepository.find({ relations: ['block'], where: { quizeType: quizeType } });
  }

  async findById(id: number): Promise<Question> {
    return this.questionRepository.findOne(id, { relations: ['block'] });
  }

  async create(questionData: ChangeQuestionDto): Promise<Question> {
    const block = await this.blockRepository.findOne(questionData.block);

    const question = new Question();
    question.description = questionData.description;
    question.image = questionData.image;
    question.type = questionData.type;
    question.options = questionData.options;
    question.quizeType = questionData.quizeType;
    question.block = block;

    return this.questionRepository.save(question);
  }

  async update(id: number, questionData: ChangeQuestionDto): Promise<Question> {
    const question = await this.questionRepository.findOne(id);
    const block = await this.blockRepository.findOne(questionData.block);

    question.description = questionData.description;
    question.image = questionData.image;
    question.type = questionData.type;
    question.options = questionData.options;
    question.block = block;

    return this.questionRepository.save(question);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.questionRepository.delete(id);
  }
}
