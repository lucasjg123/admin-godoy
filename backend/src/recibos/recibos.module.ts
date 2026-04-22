import { Module } from '@nestjs/common';
import { RecibosService } from './recibos.service';
import { RecibosController } from './recibos.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [RecibosController],
  providers: [RecibosService],
  imports: [PrinterModule, MailModule],
})
export class RecibosModule {}
