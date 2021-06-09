import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Answer } from "./answer.entity";
import { AnswerService } from "./answer.service";
import { CreateAnswerDto } from "./create-answer.dto";

@ApiBearerAuth()
@ApiTags('answers')
@Controller('answers')
export class AnswerController {
  constructor(
    private answerService: AnswerService,
  ) {}

  @ApiOperation({ summary: 'Get all answers' })
  @ApiResponse({ status: 200, description: 'Return all answers.'})
  @Get('')
  getAnswers(): Promise<Answer[]> {
    return this.answerService.findAll();
  }

  @ApiOperation({ summary: 'Get answer by id' })
  @ApiResponse({ status: 200, description: 'Return answer by id.'})
  @Get(':id')
  getAnswerId(@Param('id') id: number): Promise<Answer> {
    return this.answerService.findById(id);
  }

  @ApiOperation({ summary: 'Create answer' })
  @ApiResponse({ status: 201, description: 'The answer has been successfully created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('')
  createAnswer(@Body() answer: CreateAnswerDto): Promise<Answer> {
    return this.answerService.create(answer);
  }
}