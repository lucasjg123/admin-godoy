import {
  BadRequestException,
  Controller,
  Post,
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
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('El archivo debe ser un PDF');
    }

    const cupones = await this.cobranzaService.parse(file.buffer);
    return { total: cupones.length, cupones };
  }
}