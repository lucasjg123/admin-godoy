import { Controller, Get, Param } from '@nestjs/common';
import { EdificiosService } from './edificios.service';

@Controller('edificios')
export class EdificiosController {
  constructor(private readonly edificiosService: EdificiosService) {}

  @Get()
  findAll() {
    return this.edificiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.edificiosService.findOne(+id);
  }
}
