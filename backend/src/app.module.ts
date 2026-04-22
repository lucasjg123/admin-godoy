import { Module } from '@nestjs/common';
import { EdificiosModule } from './edificios/edificios.module';
import { ExpensasModule } from './expensas/expensas.module';
import { GastosComunesModule } from './gastos-comunes/gastos-comunes.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrinterModule } from './printer/printer.module';
import { MailModule } from './mail/mail.module';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { TitularesModule } from './titulares/titulares.module';
import { RecibosModule } from './recibos/recibos.module';

@Module({
  imports: [
    EdificiosModule,
    ExpensasModule,
    GastosComunesModule,
    PrismaModule,
    PrinterModule,
    MailModule,
    DepartamentosModule,
    TitularesModule,
    RecibosModule,
  ],
})
export class AppModule {}
