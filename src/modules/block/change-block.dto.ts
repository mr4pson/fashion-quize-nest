import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeBlockDto {
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
  readonly color: string;
}