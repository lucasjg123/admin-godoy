import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTitularDto } from './dto/create-titular.dto';
import { UpdateTitularDto } from './dto/update-titular.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TitularesService {
  constructor(private prisma: PrismaService) {}

  async createAndAssign(createTitularDto: CreateTitularDto, id_depto: number) {
    try {
      // 1️⃣ Crear titular
      const titular = await this.prisma.titulares.create({
        data: createTitularDto,
      });

      // 2️⃣ Crear relación
      await this.prisma.departamentos_titulares.create({
        data: {
          id_depto: id_depto,
          id_tit: titular.id_tit,
        },
      });
      return titular;
    } catch (error) {
      // Manejo de email duplicado (P2002)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('El email ya está registrado');
        }
      }
      throw error;
    }
  }

  async update(id_tit: number, updateTitularDto: UpdateTitularDto) {
    try {
      return await this.prisma.titulares.update({
        where: { id_tit },
        data: updateTitularDto,
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Expensa con id ${id_tit} no encontrada`);
    }
  }

  async removeAndUnassign(id_tit: number, id_depto: number) {
    try {
      // 1️⃣ Eliminar relación
      await this.prisma.departamentos_titulares.delete({
        where: {
          id_depto_id_tit: {
            id_depto: id_depto,
            id_tit: id_tit,
          },
        },
      });

      // 2️⃣ Verificar si el titular quedó sin departamentos
      const remainingRelations =
        await this.prisma.departamentos_titulares.count({
          where: {
            id_tit: id_tit,
          },
        });

      // 3️⃣ Si no tiene más relaciones → eliminar titular
      if (remainingRelations === 0) {
        await this.prisma.titulares.delete({
          where: { id_tit: id_tit },
        });

        return { message: 'Titular eliminado completamente' };
      }

      return { message: 'Titular desvinculado del departamento' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findByDpto(id_depto: number) {
    try {
      return await this.prisma.departamentos_titulares.findMany({
        where: { id_depto },
        include: { titulares: true },
      });
    } catch (error) {}
  }
}
