import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { TaskStatuses } from "../shared/enum/task-statuses.enum";
import { TaskTypes } from "../shared/enum/task-types.enum";

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
  readonly type: TaskTypes;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly status: TaskStatuses;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly comment: string;
}