import { Module } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import { TitularesModule } from 'src/titulares/titulares.module';

@Module({
  controllers: [DepartamentosController],
  providers: [DepartamentosService],
  imports: [TitularesModule],
  exports: [DepartamentosService],
})
export class DepartamentosModule {}
