import { IsNumber } from 'class-validator';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { User } from '../../user/entities/user.entity';
import { Status } from '../entities/status/status.enum';

export class CreateOrderDto {
  @IsNumber()
  readonly quantity: number;

  readonly ticketsOrder: Ticket; // ticket id

  readonly sellerId: User | undefined;

  readonly customerId: User | undefined;

  readonly status: Status | undefined;
}
