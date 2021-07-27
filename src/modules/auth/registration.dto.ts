import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RegistrationDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  readonly age: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly city: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly data: string;
}