import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { QuizeTypes } from '../question/types';
import { Block } from './block.entity';
import { ChangeBlockDto } from './change-block.dto';

@Injectable()
export class BlockService {
  private blockRepository: Repository<Block>;
  constructor(
    private connection: Connection
  ) {
    this.blockRepository = this.connection.getRepository(Block);
  }

  async findAll(): Promise<Block[]> {
    return this.blockRepository.find({ relations: ['questions'] })
  }

  async findAllByQuizeType(quizeType: QuizeTypes): Promise<Block[]> {
    return this.blockRepository.createQueryBuilder("block")
    .leftJoinAndSelect("block.questions", "question")
    .where("question.quizeType = :quizeType", { quizeType })
    .getMany();
  }

  async findById(id: number): Promise<Block> {
    return this.blockRepository.findOne(id);
  }

  async create(block: ChangeBlockDto): Promise<Block> {
    return this.blockRepository.save(block);
  }

  async update(id: number, block: ChangeBlockDto): Promise<Block> {
    const toUpdate = await this.blockRepository.findOne(id);
    return this.blockRepository.save({
      ...toUpdate,
      ...block,
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.blockRepository.delete(id);
  }
}
