import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
import { Status } from '../entities/status/status.enum';

export class CreateOrderDto {
  @IsNumber()
  readonly quantity: number;

  @IsNumber()
  readonly total: number;

  readonly ticketsOrder: Ticket; // ticket id

  readonly sellerId: User | undefined;

  readonly customerId: User | undefined;

  readonly status: Status | undefined;
}
