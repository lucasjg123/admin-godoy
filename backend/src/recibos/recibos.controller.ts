import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { RecibosService } from './recibos.service';
import { CreateReciboDto } from './dto/create-recibo.dto';
import { UpdateReciboDto } from './dto/update-recibo.dto';
import type { Response } from 'express';

@Controller('recibos')
export class RecibosController {
  constructor(private readonly recibosService: RecibosService) {}

  @Post()
  async create(
    @Body() createReciboDto: CreateReciboDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.recibosService.create(createReciboDto);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Recibo';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Post('/send')
  async sendMail(@Body() createReciboDto: CreateReciboDto) {
    await this.recibosService.sendReciboByEmail(createReciboDto);
    return {
      success: true,
      message: 'Recibo enviado correctamente',
    };
  }
}
