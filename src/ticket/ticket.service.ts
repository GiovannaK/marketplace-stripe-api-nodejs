import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async createTicket(request: Request | any, createTicketDto: CreateTicketDto) {
    const ticket = await this.ticketRepository.create({
      ...createTicketDto,
      sellerId: request.user.id,
      ticketCategory: createTicketDto.category,
      isOnline: true,
    });

    if (!ticket) {
      throw new InternalServerErrorException('Cannot create ticket');
    }

    return this.ticketRepository.save(ticket);
  }

  async findTicketById(id: string) {
    const ticket = await this.ticketRepository.findOne(id, {
      relations: ['sellerId', 'ticketCategory'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async findAllTickets() {
    const tickets = await this.ticketRepository.find({
      relations: ['sellerId', 'ticketCategory'],
      order: {
        updatedAt: 'DESC',
      },
    });
    return tickets;
  }

  async subtractTicketQuantity(id: string, quantity: number) {
    const ticket = await this.findTicketById(id);

    const currentQuantity = ticket.quantity - quantity;

    if (currentQuantity <= 0) {
      throw new ConflictException('out of stock');
    }

    await this.ticketRepository.update(ticket, {
      quantity: currentQuantity,
    });

    const updatedQuantity = this.ticketRepository.create({
      ...ticket,
      quantity: currentQuantity,
    });

    await this.ticketRepository.save(updatedQuantity);

    return updatedQuantity;
  }

  async addTicketQuantity(id: string, quantity: number) {
    const ticket = await this.findTicketById(id);

    const currentQuantity = ticket.quantity + quantity;

    await this.ticketRepository.update(ticket, {
      quantity: currentQuantity,
    });

    const updatedQuantity = this.ticketRepository.create({
      ...ticket,
      quantity: currentQuantity,
    });

    if (!updatedQuantity) {
      throw new InternalServerErrorException('Cannot update ticket quantity');
    }

    await this.ticketRepository.save(updatedQuantity);

    return {
      quantity: updatedQuantity.quantity,
    };
  }

  async updateTicket(
    id: string,
    updateTicketDto: UpdateTicketDto,
    request: Request | any,
  ) {
    const ticket = await this.findTicketById(id);

    this.checkIfSellerIsOwnerOfTicket(ticket, request);

    await this.ticketRepository.update(ticket, {
      ...updateTicketDto,
    });

    const updatedTicket = this.ticketRepository.create({
      ...ticket,
      ...updateTicketDto,
    });

    await this.ticketRepository.save(updatedTicket);

    return updatedTicket;
  }

  async deleteTicket(id: string, request: Request | any) {
    const ticket = await this.findTicketById(id);

    this.checkIfSellerIsOwnerOfTicket(ticket, request);

    if (!ticket) {
      throw new InternalServerErrorException('Ticket not found');
    }

    return await this.ticketRepository.remove(ticket);
  }

  // check if current seller is owner of ticket id
  checkIfSellerIsOwnerOfTicket(ticket: Ticket, request: Request | any) {
    if (request.user.id !== ticket.sellerId.id) {
      throw new UnauthorizedException('Unauthorized to update this ticket');
    }
    return;
  }
}
