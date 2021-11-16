import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { Status } from '../entities/status/status.enum';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto {
  @IsNotEmpty()
  status: Status;
}

/* extends PartialType(CreateOrderDto) {} */
