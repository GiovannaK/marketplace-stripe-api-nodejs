import {
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
    });

    if (!ticket) {
      throw new InternalServerErrorException('Cannot create ticket');
    }

    return this.ticketRepository.save(ticket);
  }

  async findTicketById(id: string) {
    const ticket = await this.ticketRepository.findOne(id, {
      relations: ['sellerId'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async findAllTickets() {
    const tickets = await this.ticketRepository.find({
      relations: ['sellerId'],
      order: {
        updatedAt: 'DESC',
      },
    });
    return tickets;
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
