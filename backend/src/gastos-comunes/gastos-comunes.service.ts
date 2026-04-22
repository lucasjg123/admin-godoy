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

  private async recalcularExpensas(tx: Tx, idEdif: number, gasto) {
    const departamentos = await tx.departamentos.findMany({
      where: { id_edif: idEdif },
      select: { id_depto: true, porc_depto: true },
    });

    const montoBase = gasto.monto_gc ?? 0;
    const interes = gasto.interes_gc ?? 0;

    for (const dpto of departamentos) {
      const porcentaje = dpto.porc_depto ?? 0;

      // 🔹 VTO 1
      let montoVto1 = (montoBase * porcentaje) / 100;

      // 🔹 VTO 2
      let montoVto2 = montoVto1 * (1 + interes / 100);

      // 🔥 REDONDEO FINAL
      montoVto1 = Number(montoVto1.toFixed(2));
      montoVto2 = Number(montoVto2.toFixed(2));

      await tx.expensas.updateMany({
        where: { id_depto: dpto.id_depto },
        data: {
          vto1_exp: montoVto1,
          vto2_exp: montoVto2,
        },
      });
    }
  }

  updateByEdificio(idEdif: number, updateGastosComunDto: UpdateGastosComunDto) {
    return this.prisma.$transaction(async (tx: Tx) => {
      const gastoComun = await this.updateGastoComun(
        tx,
        idEdif,
        updateGastosComunDto,
      );
      await this.recalcularExpensas(tx, idEdif, gastoComun);
      return gastoComun;
    });
  }
  async findByEdificio(id_edif: number) {
    return this.prisma.gastoscomunes.findFirst({
      where: { id_edif },
    });
  }
}
