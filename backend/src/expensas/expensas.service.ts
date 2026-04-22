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
    // 1️⃣ buscar expensas por id edif e iterar
    const expensas = await this.findByEdificio(id_edif);
    console.log('TOTAL EXPENSAS:', expensas.length);
    // 💥Array de promesas, contendra los [sendMail(), sendMail()] q hay q enviar
    // la idea esq se envien todos juntos
    const mails: Promise<any>[] = [];

    // 2️⃣iterear expensas.
    for (const expensa of expensas) {
      // -- obtener emails
      // extraemos todos los titulares del depto
      console.log('Procesando expensa:', expensa.id_exp);
      const titulares = await this.titularesService.findByDpto(
        expensa.id_depto,
      );
      // const titulares = expensa.departamentos?.departamentos_titulares;
      console.log('Titulares:', titulares?.length);
      if (!titulares?.length) continue; // validamos q existan

      // filtramos titulares con emails
      const emails = titulares
        .map((t) => t.titulares?.email_tit)
        .filter((email): email is string => !!email); // 👈 FIX TYPE

      console.log('Emails:', emails?.length);
      if (!emails.length) continue;
      // --

      // 👇 armamos la promesa sin bloquear el loop
      const mailPromise = (async () => {
        try {
          console.log('👉 Generando PDF', expensa.id_exp);

          const expensaPdf = await this.createExpensa(expensa);

          console.log('👉 PDF OK', expensa.id_exp);

          const pdfBuffer = await this.printer.bufferPdf(expensaPdf);

          console.log('👉 Buffer OK', expensa.id_exp);

          console.log('👉 Enviando mail', expensa.id_exp);
          const name = `${expensa.departamentos.edificios.nom_edif.toUpperCase()} ${expensa.departamentos.piso_depto.toUpperCase()} ${expensa.departamentos.letra_depto.toUpperCase()}`;

          return await this.mailService.sendMail({
            to: 'lucas9godoy@gmail.com',
            subject: `Expensa ${name}`,
            text: 'Adjuntamos su expensa en PDF.',
            attachments: [
              {
                filename: `expensa ${name}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
              },
            ],
          });
        } catch (error) {
          console.error('❌ ERROR en expensa', expensa.id_exp, error);
          throw error;
        }
      })();

      mails.push(mailPromise);
    }
    console.log('Mails encolados:', mails.length);
    // 🚀 ejecuta todo en paralelo (aunque alguno falle)
    const results = await Promise.allSettled(mails);

    // 🔍 opcional: log de errores
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`Error enviando mail #${i}`, r.reason);
      }
    });
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
