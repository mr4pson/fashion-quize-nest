import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { HasRoles } from '../auth/guard/has-roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { QuizeTypes } from '../question/types';
import { RoleType } from '../shared/enum/role-type.enum';
import { Block } from './block.entity';
import { BlockService } from './block.service';
import { ChangeBlockDto } from './change-block.dto';

@ApiBearerAuth()
@ApiTags('blocks')
@Controller('blocks')
export class BlockController {
  constructor(
    private blockService: BlockService,
  ) {}

  @ApiOperation({ summary: 'Get all blocks' })
  @ApiResponse({ status: 200, description: 'Return all blocks.'})
  @Get('')
  getBlocks(): Promise<Block[]> {
    return this.blockService.findAll();
  }


  @ApiOperation({ summary: 'Get all blocks and filter questions by quize type' })
  @ApiResponse({ status: 200, description: 'Return all blocks and filters questions by quize type.'})
  @Get('filterQuestionsByQuizeType/:quizeType')
  getBlockAndFilterQuiestionsByQuizeType(@Param('quizeType') quizeType: QuizeTypes): Promise<Block[]> {
    return this.blockService.findAllByQuizeType(quizeType);
  }

  @ApiOperation({ summary: 'Get block by id' })
  @ApiResponse({ status: 200, description: 'Return block by id.'})
  @Get(':id')
  getBlockById(@Param('id') id: number): Promise<Block> {
    return this.blockService.findById(id);
  }

  @ApiOperation({ summary: 'Create block' })
  @ApiResponse({ status: 201, description: 'The block has been successfully created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createBlock(@Body() block: ChangeBlockDto): Promise<Block> {
    return this.blockService.create(block);
  }

  @ApiOperation({ summary: 'Update block' })
  @ApiResponse({ status: 201, description: 'The block has been successfully updated.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateBlock(
    @Param('id') id: number,
    @Body() block: ChangeBlockDto
  ): Promise<Block> {
    return this.blockService.update(id, block);
  }

  @ApiOperation({ summary: 'Remove block' })
  @ApiResponse({ status: 201, description: 'The block has been successfully removed.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteBlock(@Param('id') id: number): Promise<DeleteResult> {
    return this.blockService.delete(id);
  }
}
