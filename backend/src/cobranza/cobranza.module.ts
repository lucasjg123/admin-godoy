import { Module } from '@nestjs/common';
import {CobranzaController} from './cobranza.controller';
import { CobranzaService } from './cobranza.service';
import { GastosComunesModule } from 'src/gastos-comunes/gastos-comunes.module';
import { DepartamentosModule } from 'src/departamentos/departamentos.module';

@Module({
  controllers: [CobranzaController],
  providers: [CobranzaService],
  imports: [GastosComunesModule, DepartamentosModule],
})
export class CobranzaModule {}