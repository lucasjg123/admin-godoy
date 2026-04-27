import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateExpensaDto } from './dto/update-expensa.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrinterService } from 'src/printer/printer.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  formatMoney,
  formatShortDate,
  formatPreviousMonth,
} from 'src/utils/formats';
import { MailService } from 'src/mail/mail.service';
import { ExpensaPdf } from './types/expensa-pdf';
import { buildExpensaTemplate } from './template/expensa.template';
import { TitularesService } from 'src/titulares/titulares.service';

@Injectable()
export class ExpensasService {
  constructor(
    private prisma: PrismaService,
    private readonly printer: PrinterService,
    private readonly mailService: MailService,
    private readonly titularesService: TitularesService,
  ) {}

  async findByEdificio(id_edif: number) {
    return this.prisma.expensas.findMany({
      where: {
        departamentos: {
          id_edif: id_edif,
        },
      },
      orderBy: [
        {
          departamentos: {
            piso_depto: 'asc',
          },
        },
        {
          departamentos: {
            letra_depto: 'asc',
          },
        },
      ],

      include: {
        departamentos: {
          include: {
            departamentos_titulares: {
              where: {
                titulares: {
                  rol_tit: 'TITULAR',
                },
              },
              include: {
                titulares: true,
              },
              take: 1, // 👈 garantiza 1 solo propietario
            },
            edificios: {
              include: {
                gastoscomunes: true,
              },
            },
          },
        },
      },
    });
  }

  // aca poner el formato var dd exp y pasar datos
  async generateExpensa(): Promise<PDFKit.PDFDocument> {
    // 🔎 1. Buscar expensa con su departamento
    const expensas = await this.findByEdificio(9);
    const exp = expensas[0];

    return this.createExpensa(exp);
  }

  // genera la exp en pdf. ToDo: renombrar por "generateExpensaPDF" y cambiiar generateExpensa por show exp
  async createExpensa(exp: ExpensaPdf): Promise<PDFKit.PDFDocument> {
    const docDefinition = buildExpensaTemplate(exp);
    return this.printer.createPdf(docDefinition);
  }


  async sendExpensaByEmail(id_edif: number, file?: Express.Multer.File) {
  const expensas = await this.findByEdificio(id_edif);
  console.log(`Iniciando envío masivo: ${expensas.length} expensas.`);

  const mails = expensas.map(async (expensa) => {
    try {
      // 1. Obtener titulares (aquí el await solo bloquea ESTA promesa, no el loop entero)
      const titulares = await this.titularesService.findByDpto(expensa.id_depto);
      const emails = titulares
        ?.map((t) => t?.titulares?.email_tit)
        .filter((email): email is string => !!email) || [];

      if (emails.length === 0) return `Saltado: ${expensa.id_exp} (sin emails)`;

      // 2. Generación de PDF propio de la expensa
      const expensaDoc = await this.createExpensa(expensa);
      const pdfBuffer = await this.printer.bufferPdf(expensaDoc);

      // 3. Preparar adjuntos
      const name = `${expensa.departamentos.edificios.nom_edif} ${expensa.departamentos.piso_depto} ${expensa.departamentos.letra_depto}`.toUpperCase();
      
      const attachments: any[] = [
        {
          filename: `expensa ${name}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }
      ];

      // 📎 Si viene un archivo extra (file), lo adjuntamos
      if (file && file.buffer) {
        attachments.push({
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        });
      }
      else{
        console.log('no hay archivo adjunto detalle de gastos com');
      }

      // 4. Enviar mail
      return await this.mailService.sendMail({
        to: 'lucas9godoy@gmail.com', // 👈 Deberías usar el array de emails encontrados, no uno fijo
        subject: `Expensa ${name} y Detalle de gastos comunes`,
        text: 'Adjuntamos su expensa en PDF y detalle de gastos.',
        attachments,
      });

    } catch (error) {
      console.error(`❌ Error en expensa ID ${expensa.id_exp}:`, error.message);
      throw error; // Re-lanzamos para que Promise.allSettled lo capture
    }
  });

  const results = await Promise.allSettled(mails);
  
  // Resumen de éxito/error
  const exitosos = results.filter(r => r.status === 'fulfilled').length;
  const fallidos = results.filter(r => r.status === 'rejected').length;
  console.log(`Finalizado: ${exitosos} enviados, ${fallidos} fallidos.`);
}

  async update(id_exp: number, updateExpensaDto: UpdateExpensaDto) {
    try {
      return await this.prisma.expensas.update({
        where: { id_exp },
        data: updateExpensaDto,
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Expensa con id ${id_exp} no encontrada`);
    }
  }
}
