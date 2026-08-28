import {
  BadRequestException,
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CobranzaService } from './cobranza.service';

@Controller('cobranza')
export class CobranzaController {
  constructor(private readonly cobranzaService: CobranzaService) {}

  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  async parse(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Debe adjuntar un archivo PDF');
    if (file.mimetype !== 'application/pdf') throw new BadRequestException('El archivo debe ser un PDF');    

    const cupones = await this.cobranzaService.parse(file.buffer);
    return { total: cupones.length, cupones };
  }

  @Post('aplicar/edificio/:id_edif')
  @UseInterceptors(FileInterceptor('file'))
  async aplicar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id_edif', ParseIntPipe) id_edif: number
  ) {
    if (!file) throw new BadRequestException('Debe adjuntar un archivo PDF');
    if (file.mimetype !== 'application/pdf') throw new BadRequestException('El archivo debe ser un PDF');
    return this.cobranzaService.aplicar(file.buffer, id_edif);
  }
}