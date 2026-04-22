import { departamentos, edificios, titulares } from '@prisma/client';
import { CreateReciboDto } from '../dto/create-recibo.dto';
import { ReciboPdfData } from '../types/recibo-pdf';

export function mapToReciboPdfData(
  dto: CreateReciboDto,
  edificio: edificios | null,
  depto: departamentos,
  titular: titulares,
): ReciboPdfData {
  return {
    anio: dto.anio,
    meses: dto.meses,
    monto: dto.monto,

    depto: {
      id: depto.id_depto,
      piso: depto.piso_depto,
      letra: depto.letra_depto,
    },

    edificio: {
      nombre: edificio?.nom_edif ?? '',
    },

    titular: {
      nombre: titular.nom_tit,
      apellido: titular.ape_tit ?? '',
      email: titular.email_tit ?? '',
    },
  };
}
