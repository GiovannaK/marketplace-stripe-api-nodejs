import {
  Body,
  Controller,
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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createOrder(
    @Body() creteOrderDto: CreateOrderDto,
    @Req() request: Request,
  ) {
    try {
      return await this.orderService.createOrder(creteOrderDto, request);
    } catch (error) {
      return new InternalServerErrorException('Cannot create order');
    }
  }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.updateOrder(id, updateOrderDto);
  }
}
