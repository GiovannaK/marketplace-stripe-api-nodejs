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
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly ticketService: TicketService,
  ) {}

  async getSellerAndTicket(ticketId) {
    const ticket = await this.ticketService.findTicketById(ticketId);
    return ticket;
  }

  async createOrder(createOrderDto: CreateOrderDto, request: Request | any) {
    const ticket = await this.getSellerAndTicket(createOrderDto.ticketsOrder);

    const order = await this.orderRepository.create({
      ...createOrderDto,
      customerId: request.user.customerId,
      status: Status.CREATED,
      sellerId: ticket.sellerId,
      ticketsOrder: ticket,
    });

    if (!order) {
      throw new InternalServerErrorException('Cannot create Order');
    }

    const createdOrder = await this.orderRepository.save(order);

    const updatedQuantity = await this.ticketService.subtractTicketQuantity(
      createdOrder.ticketsOrder.id,
      createdOrder.quantity,
    );
    return {
      createdOrder,
      quantity: updatedQuantity.quantity,
    };
  }

  // update order status
  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOrderById(id);

    await this.orderRepository.update(order, {
      ...updateOrderDto,
    });

    const updateOrder = this.orderRepository.create({
      ...order,
      ...updateOrderDto,
    });

    const updatedOrder = await this.orderRepository.save(updateOrder);

    console.log('UPD', updatedOrder);

    if (updatedOrder.status === Status.FAIL) {
      const updatedQuantity = await this.ticketService.addTicketQuantity(
        order.ticketsOrder.id,
        updatedOrder.quantity,
      );
      return {
        updatedQuantity,
        updatedOrder,
        message: 'FAIL',
      };
    }

    return updatedOrder;
  }

  async findOrderById(id: string) {
    const order = await this.orderRepository.findOne(id, {
      relations: ['ticketsOrder'],
    });
    if (!order) {
      throw new NotFoundException('Cannot found order');
    }

    return order;
  }
}
