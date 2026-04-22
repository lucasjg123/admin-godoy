import { Injectable } from '@nestjs/common';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartamentosService {
  constructor(private prisma: PrismaService) {}
  create(createDepartamentoDto: CreateDepartamentoDto) {
    return 'This action adds a new departamento';
  }

  findAll() {
    return `This action returns all departamentos`;
  }

  async search(nombre?: string, apellido?: string, id_edif?: number) {
    return this.prisma.departamentos.findMany({
      where: {
        ...(nombre || apellido
          ? {
              departamentos_titulares: {
                some: {
                  titulares: {
                    AND: [
                      nombre ? { nom_tit: { contains: nombre } } : {},
                      apellido ? { ape_tit: { contains: apellido } } : {},
                    ],
                  },
                },
              },
            }
          : {}),

        ...(id_edif && {
          edificios: {
            id_edif: id_edif,
          },
        }),
      },

      orderBy: [{ piso_depto: 'asc' }, { letra_depto: 'asc' }],

      include: {
        edificios: true,
        departamentos_titulares: {
          where: {
            titulares: {
              AND: [
                nombre ? { nom_tit: { contains: nombre } } : {},
                apellido ? { ape_tit: { contains: apellido } } : {},
              ],
            },
          },
          include: {
            titulares: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    // traer todos los titularess dea
    return this.prisma.departamentos.findUnique({
      where: {
        id_depto: id, // el departamento que quieras
      },
      include: {
        departamentos_titulares: {
          include: {
            titulares: true,
          },
        },
      },
    });
  }

  update(id: number, updateDepartamentoDto: UpdateDepartamentoDto) {
    return `This action updates a #${id} departamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} departamento`;
  }
}
