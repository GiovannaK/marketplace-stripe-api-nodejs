import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  async createSeller(@Body() createUserdto: CreateUserDto) {
    return await this.sellerService.createSeller(createUserdto);
  }
}
