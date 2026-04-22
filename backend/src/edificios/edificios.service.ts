import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EdificiosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.edificios.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} edificio`;
  }
}
