import { IsNotEmpty } from 'class-validator';
import { Status } from '../entities/status/status.enum';

export class UpdateOrderDto {
  @IsNotEmpty()
  status: Status;
}

/* extends PartialType(CreateOrderDto) {} */
