import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  providers: [StripeService],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
