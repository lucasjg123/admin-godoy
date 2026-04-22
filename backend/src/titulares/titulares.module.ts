import { Module } from '@nestjs/common';
import { TitularesService } from './titulares.service';
import { TitularesController } from './titulares.controller';

@Module({
  controllers: [TitularesController],
  providers: [TitularesService],
  exports: [TitularesService],
})
export class TitularesModule {}
