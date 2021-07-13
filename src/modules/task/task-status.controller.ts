import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { HasRoles } from '../auth/guard/has-roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { RoleType } from '../shared/enum/role-type.enum';
import { ChangeTaskStatusDto } from './change-task-status.dto';
import { TaskStatus } from './task-status.entity';
import { TaskStatusService } from './task-status.service';

@ApiBearerAuth()
@ApiTags('task-statuses')
@Controller('task-statuses')
export class TaskStatusController {
  constructor(
    private taskStatusService: TaskStatusService,
  ) {}

  @ApiOperation({ summary: 'Get all task statuses' })
  @ApiResponse({ status: 200, description: 'Return all task statuses.'})
  @Get('')
  getTaskStatuses(): Promise<TaskStatus[]> {
    return this.taskStatusService.findAll();
  }

  @ApiOperation({ summary: 'Get task status by id' })
  @ApiResponse({ status: 200, description: 'Return task status by id.'})
  @Get(':id')
  getTaskStatusById(@Param('id') id: number): Promise<TaskStatus> {
    return this.taskStatusService.findById(id);
  }

  @ApiOperation({ summary: 'Create a task status' })
  @ApiResponse({ status: 201, description: 'The task status has been successfully created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  createTaskStatus(@Body() taskStatus: ChangeTaskStatusDto): Promise<TaskStatus> {
    return this.taskStatusService.create(taskStatus);
  }

  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: 201, description: 'The task status has been successfully updated.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  updateTaskStatus(@Param('id') id: number, @Body() taskStatus: ChangeTaskStatusDto): Promise<TaskStatus> {
    return this.taskStatusService.update(id, taskStatus);
  }

  @ApiOperation({ summary: 'Remove task status' })
  @ApiResponse({ status: 201, description: 'The task status has been successfully removed.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteTaskStatus(@Param('id') id: number): Promise<DeleteResult> {
    return this.taskStatusService.delete(id);
  }
}
