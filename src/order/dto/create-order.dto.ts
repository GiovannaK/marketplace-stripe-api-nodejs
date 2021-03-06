import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { User } from '../../user/entities/user.entity';
import { Status } from '../entities/status/status.enum';

export class CreateOrderDto {
  @IsNumber()
  readonly quantity: number;

  @IsNotEmpty()
  readonly ticketsOrder: Ticket; // ticket id

  readonly sellerId: User | undefined;

  readonly status: Status | undefined;

  @IsString()
  readonly paymentMethodId: string;
}
