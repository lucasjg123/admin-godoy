import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { GastosComunesService } from './gastos-comunes.service';
import { UpdateGastosComunDto } from './dto/update-gastos-comun.dto';

@Controller('edificios/:id_edif/gastos-comunes')
export class GastosComunesController {
  constructor(private readonly gastosComunesService: GastosComunesService) {}

  @Get()
  findByEdificio(@Param('id_edif', ParseIntPipe) id_edif: number) {
    return this.gastosComunesService.findByEdificio(id_edif);
  }

  @Patch()
  update(
    @Param('id_edif', ParseIntPipe) id_edif: number,
    @Body() updateGastosComunDto: UpdateGastosComunDto,
  ) {
    return this.gastosComunesService.updateByEdificio(
      +id_edif,
      updateGastosComunDto,
    );
  }
}
