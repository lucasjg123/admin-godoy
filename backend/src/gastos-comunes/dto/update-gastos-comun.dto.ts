import { PartialType } from '@nestjs/mapped-types';
import { CreateGastoComunDto } from './create-gastos-comun.dto';

export class UpdateGastosComunDto extends PartialType(CreateGastoComunDto) {}
