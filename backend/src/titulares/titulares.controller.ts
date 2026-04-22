import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TitularesService } from './titulares.service';
import { CreateTitularDto } from './dto/create-titular.dto';
import { UpdateTitularDto } from './dto/update-titular.dto';

@Controller('titulares')
export class TitularesController {
  constructor(private readonly titularesService: TitularesService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTitulareDto: UpdateTitularDto) {
    return this.titularesService.update(+id, updateTitulareDto);
  }
}
