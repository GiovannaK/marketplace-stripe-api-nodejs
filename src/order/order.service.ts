import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Status } from './entities/status/status.enum';
import { TicketService } from 'src/ticket/ticket.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly ticketService: TicketService,
  ) {}

  async getSeller(ticketId) {
    const seller = await this.ticketService.findTicketById(ticketId);
    return seller.sellerId;
  }

  async createOrder(createOrderDto: CreateOrderDto, request: Request | any) {
    const seller = await this.getSeller(createOrderDto.ticketsOrder);
    const order = await this.orderRepository.create({
      ...createOrderDto,
      customerId: request.user.customerId,
      status: Status.CREATED,
      sellerId: seller,
    });

    if (!order) {
      throw new InternalServerErrorException('Cannot create Order');
    }

    return await this.orderRepository.save(order);
  }

  // update order status
  async updateOrder(id: string, status: Status) {
    const order = await this.findOrderById(id);

    await this.orderRepository.update(order, {
      status,
    });

    const updatedOrder = this.orderRepository.create({
      ...order,
      status,
    });

    await this.orderRepository.save(updatedOrder);

    if (order.status === Status.CREATED) {
      const updatedQuantity = await this.ticketService.subtractTicketQuantity(
        order.ticketsOrder.id,
        order.quantity,
      );
      return {
        updatedQuantity,
        updatedOrder,
      };
    }

    if (order.status === Status.FAIL) {
      const updatedQuantity = await this.ticketService.subtractTicketQuantity(
        order.ticketsOrder.id,
        0,
      );
      return {
        updatedQuantity,
        updatedOrder,
      };
    }

    return updatedOrder;
  }

  async findOrderById(id: string) {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException('Cannot found order');
    }

    return order;
  }
}
