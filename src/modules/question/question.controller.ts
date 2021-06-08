import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DeleteResult } from "typeorm";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ChangeQuestionDto } from "./change-question.dto";
import { Question } from "./question.entity";
import { QuestionService } from "./question.service";

@ApiBearerAuth()
@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(
    private questionService: QuestionService,
  ) {}

  @ApiOperation({ summary: 'Get all questions' })
  @ApiResponse({ status: 200, description: 'Return all questions.'})
  @Get('')
  getQuestions(): Promise<Question[]> {
    return this.questionService.findAll();
  }

  @ApiOperation({ summary: 'Get question by id' })
  @ApiResponse({ status: 200, description: 'Return question by id.'})
  @Get(':id')
  getQuestionById(@Param('id') id: number): Promise<Question> {
    return this.questionService.findById(id);
  }

  @ApiOperation({ summary: 'Create question' })
  @ApiResponse({ status: 201, description: 'The question has been successfully created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('')
  @UseGuards(JwtAuthGuard)
  createQuestion(@Body() question: ChangeQuestionDto): Promise<Question> {
    return this.questionService.create(question);
  }

  @ApiOperation({ summary: 'Update question' })
  @ApiResponse({ status: 201, description: 'The question has been successfully updated.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateQuestion(
    @Param('id') id: number,
    @Body() question: ChangeQuestionDto
  ): Promise<Question> {
    return this.questionService.update(id, question);
  }

  @ApiOperation({ summary: 'Remove question' })
  @ApiResponse({ status: 201, description: 'The question has been successfully removed.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete(':id')
  deleteQuestion(@Param('id') id: number): Promise<DeleteResult> {
    return this.questionService.delete(id);
  }
}