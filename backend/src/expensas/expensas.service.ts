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

  // async sendExpensaByEmail(id_edif: number, file?: Express.Multer.File) {
  //   // 1️⃣ buscar expensas por id edif e iterar
  //   const expensas = await this.findByEdificio(id_edif);
  //   console.log(`Iniciando envío masivo: ${expensas.length} expensas.`);
  //   // 💥Array de promesas, contendra los [sendMail(), sendMail()] q hay q enviar
  //   // la idea esq se envien todos juntos
  //   const mails: Promise<any>[] = [];

  //   // 2️⃣iterear expensas.
  //   for (const expensa of expensas) {
  //     // -- obtener emails
  //     // extraemos todos los titulares del depto
  //     console.log('Procesando expensa:', expensa.id_exp);
  //     const titulares = await this.titularesService.findByDpto(
  //       expensa.id_depto,
  //     );
  //     // const titulares = expensa.departamentos?.departamentos_titulares;
  //     console.log('Titulares:', titulares?.length);
  //     if (!titulares?.length) continue; // validamos q existan

  //     // filtramos titulares con emails
  //     const emails = titulares
  //       .map((t) => t.titulares?.email_tit)
  //       .filter((email): email is string => !!email); // 👈 FIX TYPE

  //     console.log('Emails:', emails?.length);
  //     if (!emails.length) continue;
  //     // --

  //     // 👇 armamos la promesa sin bloquear el loop
  //     const mailPromise = (async () => {
  //       try {
  //         console.log('👉 Generando PDF', expensa.id_exp);

  //         const expensaPdf = await this.createExpensa(expensa);

  //         console.log('👉 PDF OK', expensa.id_exp);

  //         const pdfBuffer = await this.printer.bufferPdf(expensaPdf);

  //         console.log('👉 Buffer OK', expensa.id_exp);

  //         console.log('👉 Enviando mail', expensa.id_exp);
  //         const name = `${expensa.departamentos.edificios.nom_edif.toUpperCase()} ${expensa.departamentos.piso_depto.toUpperCase()} ${expensa.departamentos.letra_depto.toUpperCase()}`;

  //         return await this.mailService.sendMail({
  //           to: 'lucas9godoy@gmail.com',
  //           subject: `Expensa ${name}`,
  //           text: 'Adjuntamos su expensa en PDF.',
  //           attachments: [
  //             {
  //               filename: `expensa ${name}.pdf`,
  //               content: pdfBuffer,
  //               contentType: 'application/pdf',
  //             },
  //           ],
  //         });
  //       } catch (error) {
  //         console.error('❌ ERROR en expensa', expensa.id_exp, error);
  //         throw error;
  //       }
  //     })();

  //     mails.push(mailPromise);
  //   }
  //   console.log('Mails encolados:', mails.length);
  //   // 🚀 ejecuta todo en paralelo (aunque alguno falle)
  //   const results = await Promise.allSettled(mails);

  //   // 🔍 opcional: log de errores
  //   results.forEach((r, i) => {
  //     if (r.status === 'rejected') {
  //       console.error(`Error enviando mail #${i}`, r.reason);
  //     }
  //   });
  // }


  async sendExpensaByEmail(id_edif: number, file?: Express.Multer.File) {
  const expensas = await this.findByEdificio(id_edif);
  console.log(`Iniciando envío masivo: ${expensas.length} expensas.`);

  const mails = expensas.map(async (expensa) => {
    try {
      // 1. Obtener titulares (aquí el await solo bloquea ESTA promesa, no el loop entero)
      const titulares = await this.titularesService.findByDpto(expensa.id_depto);
      console.log('titulares', titulares)
      const emails = titulares
        ?.map((t) => t?.titulares?.email_tit)
        .filter((email): email is string => typeof email === 'string' && email.length > 0) || [];
        // .filter((email): email is string => !!email) || [];

      if (emails.length === 0) return `Saltado: ${expensa.id_exp} (sin emails)`;

      // 2. Generación de PDF propio de la expensa
      const expensaDoc = await this.createExpensa(expensa);
      const pdfBuffer = await this.printer.bufferPdf(expensaDoc);

      // Preparar nombre con seguridad (aquí es donde fallaba)
      // Usamos "?" para que si algo falta, devuelva "S/N" (Sin Nombre) en vez de romper
      const edificio = expensa.departamentos?.edificios?.nom_edif || 'EDIF';
      const piso = expensa.departamentos?.piso_depto || '';
      const letra = expensa.departamentos?.letra_depto || '';
      const name = `${edificio} ${piso} ${letra}`.toUpperCase().trim();
      
      // 3. Preparar adjuntos
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
