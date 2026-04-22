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

    await this.mailService.sendMail({
      to: titular?.email_tit ?? 'lucas9godoy@gmail.com',
      subject: 'Recibo de pago expensas',
      text: `${dto.mensaje}`,
      attachments: [
        {
          filename: `recibo_de_pago.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
  }
}
