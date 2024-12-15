import { PartialType } from '@nestjs/mapped-types';
import { CreatePumpSelectorDto } from './create-pump-selector.dto';

export class UpdatePumpSelectorDto extends PartialType(CreatePumpSelectorDto) {
  id: number;
}
