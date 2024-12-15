import { PartialType } from '@nestjs/mapped-types';
import { CreatePressureLossDto } from './create-pressure-loss.dto';

export class UpdatePressureLossDto extends PartialType(CreatePressureLossDto) {
  id: number;
}
