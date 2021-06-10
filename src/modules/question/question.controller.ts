import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DeleteResult } from "typeorm";
import { HasRoles } from "../auth/guard/has-roles.decorator";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles.guard";
import { RoleType } from "../shared/enum/role-type.enum";
import { ChangeQuestionDto } from "./change-question.dto";
import { Question } from "./question.entity";
import { QuestionService } from "./question.service";
import { QuizeTypes } from "./types";

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

  @ApiOperation({ summary: 'Get questions by quize type' })
  @ApiResponse({ status: 200, description: 'Return questions by quize type.'})
  @Get('byQuizeType/:quizeType')
  getQuestionsByQyizeType(@Param('quizeType') quizeType: QuizeTypes): Promise<Question[]> {
    return this.questionService.findByQuizeType(quizeType);
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
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createQuestion(@Body() question: ChangeQuestionDto): Promise<Question> {
    console.log(question);
    return this.questionService.create(question);
  }

  @ApiOperation({ summary: 'Update question' })
  @ApiResponse({ status: 201, description: 'The question has been successfully updated.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateQuestion(
    @Param('id') id: number,
    @Body() question: ChangeQuestionDto
  ): Promise<Question> {
    return this.questionService.update(id, question);
  }

  @ApiOperation({ summary: 'Remove question' })
  @ApiResponse({ status: 201, description: 'The question has been successfully removed.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteQuestion(@Param('id') id: number): Promise<DeleteResult> {
    return this.questionService.delete(id);
  }
}