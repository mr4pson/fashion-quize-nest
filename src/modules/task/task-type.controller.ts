import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { HasRoles } from '../auth/guard/has-roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { RoleType } from '../shared/enum/role-type.enum';
import { ChangeTaskTypeDto } from './change-task-type.dto';
import { TaskType } from './task-type.entity';
import { TaskTypeService } from './task-type.service';

@ApiBearerAuth()
@ApiTags('task-types')
@Controller('task-types')
export class TaskTypeController {
  constructor(
    private taskTypeService: TaskTypeService,
  ) {}

  @ApiOperation({ summary: 'Get all task types' })
  @ApiResponse({ status: 200, description: 'Return all task types.'})
  @Get('')
  getTaskTypes(): Promise<TaskType[]> {
    return this.taskTypeService.findAll();
  }

  @ApiOperation({ summary: 'Get task type by id' })
  @ApiResponse({ status: 200, description: 'Return task type by id.'})
  @Get(':id')
  getTaskTypeById(@Param('id') id: number): Promise<TaskType> {
    return this.taskTypeService.findById(id);
  }

  @ApiOperation({ summary: 'Create a task type' })
  @ApiResponse({ status: 201, description: 'The task type has been successfully created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  createTaskType(@Body() taskType: ChangeTaskTypeDto): Promise<TaskType> {
    return this.taskTypeService.create(taskType);
  }

  @ApiOperation({ summary: 'Update task type' })
  @ApiResponse({ status: 201, description: 'The task type has been successfully updated.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  updateTaskType(@Param('id') id: number, @Body() taskType: ChangeTaskTypeDto): Promise<TaskType> {
    return this.taskTypeService.update(id, taskType);
  }

  @ApiOperation({ summary: 'Remove task type' })
  @ApiResponse({ status: 201, description: 'The task type has been successfully removed.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteTaskType(@Param('id') id: number): Promise<DeleteResult> {
    return this.taskTypeService.delete(id);
  }
}
