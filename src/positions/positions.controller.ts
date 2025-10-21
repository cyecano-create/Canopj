// i change the import to positionsservice and also i put a position_id and put in the body the position_code,position_name 
//  also i put a userId so the id he well get is from the users table

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.positionsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':position_id')
  async getOne(@Param('position_id') position_id: string) {
    return this.positionsService.findById(+position_id);
  }


  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() body: { position_code: string; position_name: string },
    @Request() req: any,
  ) {
    const userId = req.user.id; 
    return this.positionsService.createPositions(body.position_code, body.position_name, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':position_id')
  async update(@Param('position_id') position_id: string, @Body() body: any) {
    return this.positionsService.updatePosition(+position_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':position_id')
  async remove(@Param('position_id') position_id: string) {
    return this.positionsService.deletePositions(+position_id);
  }
}
