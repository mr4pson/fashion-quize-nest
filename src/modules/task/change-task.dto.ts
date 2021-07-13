import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangeTaskDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly date: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly type: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly status: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly comment: string;
}