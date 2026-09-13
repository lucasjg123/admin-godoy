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
    const result = await this.recibosService.sendReciboByEmail(createReciboDto);
    
    // Si ambos procesos fueron exitosos
    if (result.emailSent && result.n8nSuccess) {
      return {
        success: true,
        message: 'Recibo enviado y pago registrado correctamente',
        ...result,
      };
    }

    // Si hubo errores, retornar con success: false
    return {
      success: false,
      message: 'Hubo errores al procesar el recibo',
      ...result,
    };
  }
}
