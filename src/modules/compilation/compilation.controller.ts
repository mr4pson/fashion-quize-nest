import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { HasRoles } from '../auth/guard/has-roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { RoleType } from '../shared/enum/role-type.enum';
import { CreateCompilationDto } from './create-compilation.dto';
import { Compilation } from './compilation.entity';
import { CompilationService } from './compilation.service';
import { UpdateCompilationDto } from './update-compilation.dto';

@ApiBearerAuth()
@ApiTags('compilations')
@Controller('compilations')
export class CompilationController {
  constructor(
    private compilationService: CompilationService,
  ) {

  }
  @ApiOperation({ summary: 'Get all compilations' })
  @ApiResponse({ status: 200, description: 'Return all compilations.'})
  @Get('')
  @HasRoles(RoleType.STYLIST, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getCompilations(): Promise<Compilation[]> {
    return this.compilationService.findAll();
  }

  @ApiOperation({ summary: 'Get compilation by id' })
  @ApiResponse({ status: 200, description: 'Return compilation by id.'})
  @HasRoles(RoleType.STYLIST, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  getCompilationById(@Param('id') id: number): Promise<Compilation> {
    return this.compilationService.findById(id);
  }

  @ApiOperation({ summary: 'Create compilation' })
  @ApiResponse({ status: 201, description: 'The compilation has been successfully created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.STYLIST, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  createCompilation(@Body() compilation: CreateCompilationDto): Promise<Compilation> {
    return this.compilationService.create(compilation);
  }

  @ApiOperation({ summary: 'Update compilation' })
  @ApiResponse({ status: 201, description: 'The compilation has been successfully updated.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.USER, RoleType.STYLIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  updateCompilation(@Param('id') id: number, @Body() compilation: UpdateCompilationDto): Promise<Compilation> {
    return this.compilationService.update(id, compilation);
  }

  @ApiOperation({ summary: 'Remove compilation' })
  @ApiResponse({ status: 201, description: 'The compilation has been successfully removed.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HasRoles(RoleType.USER, RoleType.STYLIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteCompilation(@Param('id') id: number): Promise<DeleteResult> {
    return this.compilationService.delete(id);
  }
}
