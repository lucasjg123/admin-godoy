import { Module } from '@nestjs/common';
import { ExpensasService } from './expensas.service';
import { ExpensasController } from './expensas.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { MailModule } from 'src/mail/mail.module';
import { TitularesModule } from 'src/titulares/titulares.module';

@Module({
  controllers: [ExpensasController],
  providers: [ExpensasService],
  imports: [PrinterModule, MailModule, TitularesModule],
})
export class ExpensasModule {}
