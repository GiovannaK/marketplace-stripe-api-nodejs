import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { TicketModule } from 'src/ticket/ticket.module';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Ticket, Order]),
    TicketModule,
    StripeModule,
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
