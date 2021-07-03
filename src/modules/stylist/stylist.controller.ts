import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { HasRoles } from '../auth/guard/has-roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { RoleType } from '../shared/enum/role-type.enum';
import { User } from "../user/model/user.entity";
import { ChangeStylistDto } from './change-stylist.dto';
import { StylistService } from "./stylist.service";

@ApiBearerAuth()
@ApiTags('stylists')
@Controller('stylists')
export class StylistController {
  constructor(
    private stylistService: StylistService,
  ) {}

  @ApiOperation({ summary: 'Get all stylists' })
  @ApiResponse({ status: 200, description: 'Return all stylists.'})
  @Get('')
  getStylists(): Promise<User[]> {
    return this.stylistService.findAll();
  }

  @ApiOperation({ summary: 'Get stylist by id' })
  @ApiResponse({ status: 200, description: 'Return stylist by id.'})
  @Get(':id')
  getStylistById(@Param('id') id: number): Promise<User> {
    return this.stylistService.findById(id);
  }

  @ApiOperation({ summary: 'Create stylist' })
  @ApiResponse({ status: 201, description: 'The stylist has been successfully created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createStylist(@Body() stylist: ChangeStylistDto): Promise<User> {
    return this.stylistService.create(stylist);
  }

  @ApiOperation({ summary: 'Update stylist' })
  @ApiResponse({ status: 201, description: 'The stylist has been successfully updated.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateStylist(
    @Param('id') id: number,
    @Body() stylist: ChangeStylistDto
  ): Promise<User> {
    return this.stylistService.update(id, stylist);
  }

  @ApiOperation({ summary: 'Remove stylist' })
  @ApiResponse({ status: 201, description: 'The stylist has been successfully removed.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteStylist(@Param('id') id: number): Promise<DeleteResult> {
    return this.stylistService.delete(id);
  }
}