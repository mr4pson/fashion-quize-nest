import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeStylistDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly login: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly name: string;
}