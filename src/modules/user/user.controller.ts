import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HasRoles } from '../auth/guard/has-roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { RoleType } from '../shared/enum/role-type.enum';
import { User } from './model/user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.'})
  @Get('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get stylist users' })
  @ApiResponse({ status: 200, description: 'Return user.'})
  @Get('stylist-users')
  @HasRoles(RoleType.STYLIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getStylistUsers(@Request() req): Promise<User[]> {
    return this.userService.findStylistUsers(req.user.id);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Return user by id.'})
  @HasRoles(RoleType.STYLIST, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findById(id);
  }
}
