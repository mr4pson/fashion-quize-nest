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
  readonly time: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly type: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  readonly status: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  readonly comment: string;
}