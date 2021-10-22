import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/entities/role/role.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createTicket(
    @Req() request: Request,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return await this.ticketService.createTicket(request, createTicketDto);
  }
}
