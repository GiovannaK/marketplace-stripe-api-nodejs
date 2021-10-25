import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Role } from 'src/user/entities/role/role.enum';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  async createSeller(@Body() createUserdto: CreateUserDto) {
    return await this.sellerService.createSeller(createUserdto);
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findTicketBySeller(@Req() request: Request) {
    return await this.sellerService.findTicketBySeller(request);
  }
}
