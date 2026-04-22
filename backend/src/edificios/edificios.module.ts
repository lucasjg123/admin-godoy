import { Module } from '@nestjs/common';
import { EdificiosService } from './edificios.service';
import { EdificiosController } from './edificios.controller';

@Module({
  controllers: [EdificiosController],
  providers: [EdificiosService],
})
export class EdificiosModule {}
