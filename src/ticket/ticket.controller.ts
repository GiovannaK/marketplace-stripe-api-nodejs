import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/entities/role/role.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
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
    try {
      return await this.ticketService.createTicket(request, createTicketDto);
    } catch (error) {
      throw new InternalServerErrorException('Cannot create ticket');
    }
  }

  @Get(':id')
  async findTicketById(@Param('id') id: string) {
    try {
      return await this.ticketService.findTicketById(id);
    } catch (error) {
      throw new InternalServerErrorException('Cannot found ticket');
    }
  }

  @Get()
  async findAllTickets() {
    try {
      return await this.ticketService.findAllTickets();
    } catch (error) {
      throw new InternalServerErrorException('Cannot found tickets');
    }
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async updateTicket(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @Req() request: Request,
  ) {
    try {
      return await this.ticketService.updateTicket(
        id,
        updateTicketDto,
        request,
      );
    } catch (error) {
      throw new InternalServerErrorException('Cannot update ticket');
    }
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteTicket(@Param('id') id: string, @Req() request: Request) {
    try {
      return await this.ticketService.deleteTicket(id, request);
    } catch (error) {
      throw new InternalServerErrorException('Cannot delete ticket');
    }
  }
}
