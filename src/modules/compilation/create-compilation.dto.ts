import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCompilationDto {
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  readonly taskId: number;

  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  readonly status: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly looks: string;
}