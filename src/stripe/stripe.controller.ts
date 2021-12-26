import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/entities/role/role.enum';
import { CreateCharge } from './dto/create-charge.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('accountLinks')
  async createAccountLink(@Req() request: Request) {
    try {
      return await this.stripeService.createAccountLink(request);
    } catch (error) {
      throw new InternalServerErrorException('Cannot generate account link');
    }
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('loginLink')
  async createLoginLink(@Req() request: Request) {
    return await this.stripeService.createLoginLink(request);
  }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('checkout')
  async createCharge(
    @Body() createChargeDto: CreateCharge,
    @Req() request: any,
  ) {
    return await this.stripeService.charge(
      createChargeDto.amount,
      createChargeDto.paymentMethodId,
      request.user.customerId,
      createChargeDto.id,
      createChargeDto.orderId,
    );
  }
}
