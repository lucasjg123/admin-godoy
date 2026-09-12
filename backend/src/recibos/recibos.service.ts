import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReciboDto } from './dto/create-recibo.dto';
import { MailService } from 'src/mail/mail.service';
import { PrinterService } from 'src/printer/printer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildReciboTemplate } from './template/recibo.template';
import { mapToReciboPdfData } from './helpers/map-recibo';

@Injectable()
export class RecibosService {
  constructor(
    private prisma: PrismaService,
    private readonly printer: PrinterService,
    private readonly mailService: MailService,
  ) {}

  // devuelve un recibo pdf
  async create(dto: CreateReciboDto): Promise<PDFKit.PDFDocument> {
    //---- Buscamos info necesaria para complementar recibo en base a las ids
    const depto = await this.prisma.departamentos.findUnique({
      where: { id_depto: dto.id_depto },
      include: {
        edificios: true,
      },
    });
    if (!depto) throw new NotFoundException('Departamento no encontrado');

    const edificio = depto?.edificios;

    const titular = await this.prisma.titulares.findUnique({
      where: { id_tit: dto.id_tit },
    });

    if (!titular) throw new NotFoundException('Titular no encontrado');
    //----

    // creo un objeto normalizado con datos para mandar a la template
    const data = mapToReciboPdfData(dto, edificio, depto, titular);
    // crea la template para crear  el pdf
    const docDefinition = buildReciboTemplate(data);
    return this.printer.createPdf(docDefinition);
  }

  async sendReciboByEmail(dto: CreateReciboDto) {
    const recibo = await this.create(dto);
    const pdfBuffer = await this.printer.bufferPdf(recibo);

    const titular = await this.prisma.titulares.findUnique({
      where: { id_tit: dto.id_tit },
    });

    const depto = await this.prisma.departamentos.findUnique({
      where: { id_depto: dto.id_depto },
      include: {
        edificios: true,
      },
    });

    // Enviar email
    // await this.mailService.sendMail({
    //   to: titular?.email_tit ?? 'lucas9godoy@gmail.com',
    //   subject: 'Recibo de pago expensas',
    //   text: `${dto.mensaje}`,
    //   attachments: [
    //     {
    //       filename: `recibo_de_pago.pdf`,
    //       content: pdfBuffer,
    //       contentType: 'application/pdf',
    //     },
    //   ],
    // });

    // Si el email se envió exitosamente, notificar a n8n
    await this.sendPaymentNotificationToN8n(dto, depto);
  }

  private async sendPaymentNotificationToN8n(
    dto: CreateReciboDto,
    depto: any,
  ) {
    try {
      const payload = {
        sheetId: depto?.edificios?.id_google_sheet,
        anio: dto.anio,
        depto: `${depto?.piso_depto} "${depto?.letra_depto}"`,
        mes: dto.meses[0],
        valorRegistro: 'PAGO',
      };

      console.log(
        'Enviando notificación a n8n con payload:',
        JSON.stringify(payload, null, 2),
      );

      const response = await fetch(
        process.env.N8N_WEBHOOK_URL ??
          'http://host.docker.internal:5678/webhook-test/cobranza/registrar-pago',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        console.error(
          `Error enviando notificación a n8n: ${response.status} ${response.statusText}`,
        );
      } else {
        console.log('Notificación enviada a n8n exitosamente');
      }
    } catch (error: any) {
      console.error(
        'Error al conectar con n8n:',
        error?.message || error,
      );
      console.error('Detalle del error:', error?.cause?.code);
    }
  }
}
