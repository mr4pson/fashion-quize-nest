import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { HasRoles } from '../auth/guard/has-roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { RoleType } from '../shared/enum/role-type.enum';
import { User } from '../user/model/user.entity';
import { ChangeTaskDto } from './change-task.dto';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private taskService: TaskService,
  ) {}

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.'})
  @Get('')
  @HasRoles(RoleType.STYLIST, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getTasks(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @ApiOperation({ summary: 'Get stylist tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.'})
  @Get('/stylist-tasks')
  @HasRoles(RoleType.STYLIST, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getStylistTasks(@Request() req): Promise<Task[]> {
    return this.taskService.findStylistTasks(req.user.id);
  }

  @ApiOperation({ summary: 'Get user tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.'})
  @Get('/user-tasks')
  @HasRoles(RoleType.STYLIST, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUserTasks(@Request() req): Promise<Task[]> {
    return this.taskService.findUserTasks(req.user.id);
  }

  @Get('get-most-free-stylist')
  getMostFreeStylist(): Promise<User> {
    return this.taskService.getMostFreeStylist();
  }

  @ApiOperation({ summary: 'Get task by id' })
  @ApiResponse({ status: 200, description: 'Return task by id.'})
  @HasRoles(RoleType.USER, RoleType.STYLIST, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  getTaskById(@Param('id') id: number): Promise<Task> {
    return this.taskService.findById(id);
  }

  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  createTask(@Body() task: ChangeTaskDto, @Request() req): Promise<Task> {
    return this.taskService.create(req.user.id, task);
  }

  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully updated.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.USER, RoleType.STYLIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  updateTask(@Param('id') id: number, @Body() task: ChangeTaskDto): Promise<Task> {
    return this.taskService.update(id, task);
  }

  @ApiOperation({ summary: 'Remove task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully removed.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteTask(@Param('id') id: number): Promise<DeleteResult> {
    return this.taskService.delete(id);
  }
}
