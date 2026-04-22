import { Module } from '@nestjs/common';
import { GastosComunesService } from './gastos-comunes.service';
import { GastosComunesController } from './gastos-comunes.controller';

@Module({
  controllers: [GastosComunesController],
  providers: [GastosComunesService],
})
export class GastosComunesModule {}
