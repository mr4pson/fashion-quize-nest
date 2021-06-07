import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Block } from './block.entity';
import { BlockService } from './block.service';
import { ChangeBlockDto } from './change-block.dto';

@ApiBearerAuth()
@ApiTags('articles')
@Controller('blocks')
export class BlockController {
  constructor(
    private blockService: BlockService,
  ) {}

  @ApiOperation({ summary: 'Get all blocks' })
  @ApiResponse({ status: 200, description: 'Return all blocks.'})
  @Get('')
  getBlocks(): Promise<any[]> {
    return this.blockService.findAll();
  }

  @ApiOperation({ summary: 'Get article by id' })
  @ApiResponse({ status: 200, description: 'Return article by id.'})
  @Get(':id')
  getBlockById(@Param('id') id: number): Promise<Block> {
    return this.blockService.findById(id);
  }

  @ApiOperation({ summary: 'Create block' })
  @ApiResponse({ status: 201, description: 'The block has been successfully created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('')
  @UseGuards(JwtAuthGuard)
  createBlock(@Body() block: ChangeBlockDto): Promise<Block> {
    return this.blockService.create(block);
  }

  @ApiOperation({ summary: 'Update block' })
  @ApiResponse({ status: 201, description: 'The block has been successfully updated.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
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
  deleteBlock(@Param('id') id: number): Promise<DeleteResult> {
    return this.blockService.delete(id);
  }
}
