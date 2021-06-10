import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { QuestionType, QuizeTypes } from './types';

export class ChangeQuestionDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly title: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly description: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly image: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly type: QuestionType;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly options: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly quizeType: QuizeTypes;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly blockId: string;
}