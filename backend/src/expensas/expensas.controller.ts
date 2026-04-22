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

  @Get('pdf')
  async getPdf(@Res() response: Response) {
    const pdfDoc = await this.expensasService.generateExpensa();

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Expensa';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Post('send')
  @UseInterceptors(FileInterceptor('file'))
  async sendMail(
    @Param('id_edif', ParseIntPipe) id_edif: number,
    // @UploadedFile() file: Express.Multer.File,
  ) {
    await this.expensasService.sendExpensaByEmail(id_edif);

    return {
      success: true,
      message: 'Expensas enviadas correctamente',
    };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpensaDto: UpdateExpensaDto,
  ) {
    return this.expensasService.update(+id, updateExpensaDto);
  }
}
