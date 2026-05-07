import { Injectable } from '@nestjs/common';
import { UpdateGastosComunDto } from './dto/update-gastos-comun.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

type Tx = Prisma.TransactionClient;

@Injectable()
export class GastosComunesService {
  constructor(private prisma: PrismaService) {}

  private async updateGastoComun(
    tx: Tx,
    idEdif: number,
    dto: UpdateGastosComunDto,
  ) {
    return tx.gastoscomunes.update({
      where: { id_edif: idEdif },
      data: {
        monto_gc: Number(Number(dto.monto_gc).toFixed(2)),
        interes_gc: Number(Number(dto.interes_gc).toFixed(2)),
        vto1_gc: dto.vto1_gc ? new Date(dto.vto1_gc) : undefined,
        vto2_gc: dto.vto2_gc ? new Date(dto.vto2_gc) : undefined,
      },
    });
  }

  updateByEdificio(idEdif: number, updateGastosComunDto: UpdateGastosComunDto) {
    // Aumentamos el timeout a 20 segundos para procesos pesados
    return this.prisma.$transaction(async (tx: Tx) => {
      
      // 1. Verificar si existe antes de actualizar para evitar el P2025
      const existe = await tx.gastoscomunes.findUnique({
        where: { id_edif: idEdif }
      });

      if (!existe) {
        throw new Error(`No se encontró gasto común para el edificio ${idEdif}`);
      }

      const gastoComun = await tx.gastoscomunes.update({
        where: { id_edif: idEdif },
        data: {
          monto_gc: Number(Number(updateGastosComunDto.monto_gc).toFixed(2)),
          interes_gc: Number(Number(updateGastosComunDto.interes_gc).toFixed(2)),
          vto1_gc: updateGastosComunDto.vto1_gc ? new Date(updateGastosComunDto.vto1_gc) : undefined,
          vto2_gc: updateGastosComunDto.vto2_gc ? new Date(updateGastosComunDto.vto2_gc) : undefined,
        },
      });

      await this.recalcularExpensas(tx, idEdif, gastoComun);
      
      return gastoComun;
    }, {
      timeout: 20000 // 20 segundos
    });
  }

  private async recalcularExpensas(tx: Tx, idEdif: number, gasto) {
    const departamentos = await tx.departamentos.findMany({
      where: { id_edif: idEdif },
      select: { id_depto: true, porc_depto: true },
    });

    const montoBase = gasto.monto_gc ?? 0;
    const interes = gasto.interes_gc ?? 0;

    // Usamos Promise.all para ejecutar las actualizaciones en paralelo 
    // dentro de la misma transacción, lo cual es mucho más rápido
    const actualizaciones = departamentos.map((dpto) => {
      const porcentaje = dpto.porc_depto ?? 0;
      let montoVto1 = Number(((montoBase * porcentaje) / 100).toFixed(2));
      // let montoVto2 = Number((montoVto1 * (1 + interes / 100)).toFixed(2));
      let montoVto2 = Math.round(montoVto1 * (1 + interes / 100));

      return tx.expensas.updateMany({
        where: { id_depto: dpto.id_depto },
        data: {
          vto1_exp: montoVto1,
          vto2_exp: montoVto2,
        },
      });
    });

    await Promise.all(actualizaciones);
  }

  async findByEdificio(id_edif: number) {
    return this.prisma.gastoscomunes.findFirst({
      where: { id_edif },
    });
  }
}
