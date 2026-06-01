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

  async findOne(id_exp: number){
    return this.prisma.expensas.findUnique({
      where:{
        id_exp: id_exp,
      },
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
            }
          }
      },
    });
  }

  // aca poner el formato var dd exp y pasar datos
  async generateExpensa(): Promise<PDFKit.PDFDocument> {
    // 🔎 1. Buscar expensa con su departamento
    const expensas = await this.findByEdificio(2);
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
    console.log(`🚀 Iniciando envío secuencial: ${expensas.length} expensas.`);

    // 1. Tipamos el array para que TypeScript no chille con el "never"
    const results: { status: string; id: number; error?: string }[] = [];

    for (const expensa of expensas) {
      let step = 'inicializando';
      const logId = `[Expensa: ${expensa.departamentos.edificios.nom_edif} ${expensa.departamentos.piso_depto} ${expensa.departamentos.letra_depto}]`;

      try {
        step = 'obteniendo titulares';
        const titulares = await this.titularesService.findByDpto(expensa.id_depto);
        // const emails = titulares?.map(t => t?.titulares?.email_tit).filter(e => !!e) || [];
        const emails = titulares
        ?.map(t => t?.titulares?.email_tit)
        .filter((e): e is string => !!e) || []; // <--- Aquí 'emails' pasa a ser string[] automáticamente

        if (emails.length === 0) {
          console.warn(`${logId} ⚠️ Sin destinatarios, saltando...`);
          continue;
        }

        step = 'generando PDF';
        const expensaDoc = await this.createExpensa(expensa);
        const pdfBuffer = await this.printer.bufferPdf(expensaDoc);

        step = 'preparando adjuntos';
        const edif = expensa.departamentos?.edificios?.nom_edif || 'EDIFICIO';
        
        // 2. CORRECCIÓN: Usamos letra_depto (el nombre correcto en tu DB)
        const dpto = `${expensa.departamentos?.piso_depto || ''}${expensa.departamentos?.letra_depto || ''}`;
        const name = `${edif} ${dpto}`.toUpperCase().trim();

        const attachments: any[] = [{
          filename: `expensa ${name}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }];

        if (file?.buffer) {
          attachments.push({
            filename: file.originalname,
            content: file.buffer,
            contentType: file.mimetype,
          });
        }

        step = 'enviando correo (SMTP)';
        // Extraemos el primer email para el 'to' y el resto para el 'bcc'
        const [primaryEmail, ...otherEmails] = emails;
        await this.mailService.sendMail({
          // El primer titular de la lista
          // to: primaryEmail, 
          to: 'lucas9godoy@gmail.com', // Mantenemos fijo por ahora
          // ...(otherEmails.length > 0 && { bcc: otherEmails }),
           ...(emails.length > 1 && { bcc: ['lucas9leon.lg@gmail.com'] }),
          subject: `Expensa ${name} y Detalle de gastos`,
          // text: `Adjuntamos expensa de la unidad ${name}.\nEmails reales: ${emails.join(', ')}`,
          attachments,
        });

        console.log(`✅ ${logId} Enviado correctamente`);
        results.push({ status: 'fulfilled', id: expensa.id_exp });

        // 3. PAUSA DE SEGURIDAD: Aumentamos a 3 segundos para evitar el error 421 de Google
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (error) {
        console.error(`❌ ${logId} Falló en el paso [${step}]:`, error.message);
        results.push({ status: 'rejected', id: expensa.id_exp, error: error.message });
        
        // Pausa extra si falló por SMTP para dejar que el servidor respire
        if (step === 'enviando correo (SMTP)') {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }

    const exitosos = results.filter(r => r.status === 'fulfilled').length;
    console.log('--------------------------------------------------');
    console.log(`📊 FINALIZADO | Éxitos: ${exitosos} | Fallidos: ${expensas.length - exitosos}`);
    console.log('--------------------------------------------------');
  }

  async sendOneExpensaByEmail(id_exp: number, file?: Express.Multer.File){
     const expensa = await this.findOne(id_exp);
      if (!expensa) throw new Error(`No se encontró la expensa con ID ${id_exp}`);
    const logId = `[Expensa: ${expensa.departamentos.edificios.nom_edif} ${expensa.departamentos.piso_depto} ${expensa.departamentos.letra_depto}]`;
    let step = 'inicializando';
      try {       

      step = 'obteniendo emails de titulares';
      const titulares = await this.titularesService.findByDpto(expensa.id_depto);
      const emails = titulares?.map(t => t?.titulares?.email_tit).filter(e => !!e) || [];

      // ver como hacer cuando no hay destinatarios
        if (emails.length === 0) {
        return { success: false, message: 'La unidad no tiene emails registrados.' };
      }

      step = 'generando PDF';
      const expensaDoc = await this.createExpensa(expensa);
      const pdfBuffer = await this.printer.bufferPdf(expensaDoc);

      step = 'preparando adjuntos';
      const edif = expensa.departamentos?.edificios?.nom_edif || 'EDIFICIO';
      
      // 2. CORRECCIÓN: Usamos letra_depto (el nombre correcto en tu DB)
      const dpto = `${expensa.departamentos?.piso_depto || ''}${expensa.departamentos?.letra_depto || ''}`;
      const name = `${edif} ${dpto}`.toUpperCase().trim();

      const attachments: any[] = [{
        filename: `expensa ${name}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }];

      if (file?.buffer) {
        attachments.push({
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        });
      }

      step = 'enviando correo (SMTP)';
      await this.mailService.sendMail({
        to: 'lucas9godoy@gmail.com', // Mantenemos fijo por ahora
        ...(emails.length > 1 && { bcc: ['lucas9leon.lg@gmail.com'] }),
        subject: `Expensa ${name} y Detalle de gastos`,
        // text: `Adjuntamos expensa de la unidad ${name}.\nEmails reales: ${emails.join(', ')}`,
        attachments,
      });

      console.log(`✅ ${logId} Enviado correctamente`);
      return { success: true, id: id_exp };

    } catch (error) {
       console.error(`❌ ${logId} Falló en el paso [${step}]:`, error.message);
       return { success: false, error: error.message };
    }
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
