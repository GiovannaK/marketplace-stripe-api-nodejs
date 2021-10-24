import {
  Body,
  Controller,
  Delete,
  Get,
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
    return await this.ticketService.createTicket(request, createTicketDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findTicketById(@Param('id') id: string) {
    return await this.ticketService.findTicketById(id);
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('seller')
  async findTicketBySeller(@Req() request: Request) {
    return await this.ticketService.findTicketBySeller(request);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAllTickets() {
    return await this.ticketService.findAllTickets();
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async updateTicket(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @Req() request: Request,
  ) {
    return await this.ticketService.updateTicket(id, updateTicketDto, request);
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteTicket(@Param('id') id: string, @Req() request: Request) {
    return await this.deleteTicket(id, request);
  }
}
