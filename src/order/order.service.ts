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
import { StripeService } from 'src/stripe/stripe.service';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly ticketService: TicketService,
    private readonly stripeService: StripeService,
  ) {}

  async getSellerAndTicket(ticketId) {
    const ticket = await this.ticketService.findTicketById(ticketId);
    return ticket;
  }

  verifyTotalOrder = (quantity: number, ticketPrice: number) => {
    if (quantity <= 0) {
      throw new InternalServerErrorException('Cannot accept negative quantity');
    }
    const total = quantity * ticketPrice;
    return total;
  };

  async createOrder(createOrderDto: CreateOrderDto, request: Request | any) {
    const ticket = await this.getSellerAndTicket(createOrderDto.ticketsOrder);

    const checkTotalOrder = this.verifyTotalOrder(
      createOrderDto.quantity,
      ticket.price,
    );

    const order = this.orderRepository.create({
      ...createOrderDto,
      customerId: request.user.id,
      status: Status.CREATED,
      sellerId: ticket.sellerId,
      ticketsOrder: ticket,
      total: checkTotalOrder,
    });

    if (!order) {
      throw new InternalServerErrorException('Cannot create Order');
    }

    const createdOrder = await this.orderRepository.save(order);

    const updatedQuantity = await this.ticketService.subtractTicketQuantity(
      createdOrder.ticketsOrder.id,
      createdOrder.quantity,
    );

    await this.validatePriceAndExecutingCharge(
      createOrderDto,
      request,
      ticket,
      createdOrder,
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

  async validatePriceAndExecutingCharge(
    createOrderDto: CreateOrderDto,
    request: any,
    ticket: Ticket,
    createdOrder: Order,
  ) {
    if (createdOrder.total > 0) {
      return await this.stripeService.charge(
        createdOrder.total,
        createOrderDto.paymentMethodId,
        request.user.customerId,
        ticket.sellerId,
        createdOrder.id,
      );
    }
    return;
  }
}
