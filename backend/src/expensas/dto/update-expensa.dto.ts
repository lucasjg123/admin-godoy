import { PartialType } from '@nestjs/mapped-types';
import { CreateExpensaDto } from './create-expensa.dto';

export class UpdateExpensaDto extends PartialType(CreateExpensaDto) {}
