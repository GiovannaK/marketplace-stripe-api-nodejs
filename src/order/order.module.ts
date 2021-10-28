import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
  providers: [OrderService],
  imports: [TypeOrmModule.forFeature([Ticket, Order]), TicketModule],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
