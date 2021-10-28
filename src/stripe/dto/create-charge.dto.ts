import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateCharge {
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;

  @IsNumber()
  amount: number;

  @IsNotEmpty()
  id: User;
}
