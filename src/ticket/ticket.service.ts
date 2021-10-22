import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
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
}
