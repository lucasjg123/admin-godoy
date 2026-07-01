import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ExpensasService } from './expensas.service';
import { CreateExpensaDto } from './dto/create-expensa.dto';
import { UpdateExpensaDto } from './dto/update-expensa.dto';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('edificios/:id_edif/expensas')
export class ExpensasController {
  constructor(private readonly expensasService: ExpensasService) {}

  @Get()
  findByEdificio(@Param('id_edif', ParseIntPipe) id_edif: number) {
    return this.expensasService.findByEdificio(id_edif);
  }

   @Get('depto/:id_depto')
  findByDepto(@Param('id_depto', ParseIntPipe) id_depto: number) {
    return this.expensasService.findByDepto(id_depto);
  }

  // gneera expensa pdf estatica
  @Get('pdf')
  async getPdf(@Res() response: Response) {
    const pdfDoc = await this.expensasService.generateExpensa();

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Expensa';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  // envia expensas al edificio (no se usa, mantenido como referencia)
  // @Post('send')
  // @UseInterceptors(FileInterceptor('file'))
  // async sendMail(
  //   @Param('id_edif', ParseIntPipe) id_edif: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   console.log('estamos en /send');
  //   console.log('Archivo recibido:', file?.originalname);
  //   await this.expensasService.sendExpensaByEmail(id_edif, file);
  //   return {
  //     success: true,
  //     message: 'Expensas enviadas correctamente',
  //   };
  // }

  //  envia expensa unica
  @Post(':id_exp/send')
  @UseInterceptors(FileInterceptor('file')) // Por si mandas un adjunto extra desde el front
  async sendOne(
    @Param('id_exp', ParseIntPipe) id_exp: number,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return await this.expensasService.sendOneExpensaByEmail(id_exp, file);
  }

  // update
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpensaDto: UpdateExpensaDto,
  ) {
    return this.expensasService.update(+id, updateExpensaDto);
  }
}
