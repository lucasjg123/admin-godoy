import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { CreateTitularDto } from 'src/titulares/dto/create-titular.dto';
import { TitularesService } from 'src/titulares/titulares.service';

@Controller('departamentos')
export class DepartamentosController {
  constructor(
    private readonly departamentosService: DepartamentosService,
    private readonly titularesService: TitularesService,
  ) {}

  @Get('search')
  search(
    @Query('nombre') nombre?: string,
    @Query('apellido') apellido?: string,
    @Query('id_edif') id_edif?: string,
  ) {
    return this.departamentosService.search(
      nombre,
      apellido,
      id_edif ? Number(id_edif) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departamentosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartamentoDto: UpdateDepartamentoDto,
  ) {
    return this.departamentosService.update(+id, updateDepartamentoDto);
  }

  // Crear titular y asignarlo al departamento
  @Post(':id/titulares')
  createTitular(
    @Param('id', ParseIntPipe) idDepto: number,
    @Body() dto: CreateTitularDto,
  ) {
    return this.titularesService.createAndAssign(dto, idDepto);
  }

  // Desvincular titular del departamento
  @Delete(':id/titulares/:titularId')
  removeTitularFromDepto(
    @Param('id', ParseIntPipe) idDepto: number,
    @Param('titularId', ParseIntPipe) titularId: number,
  ) {
    return this.titularesService.removeAndUnassign(titularId, idDepto);
  }
}
