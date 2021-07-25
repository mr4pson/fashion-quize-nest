import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateCompilationDto {
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