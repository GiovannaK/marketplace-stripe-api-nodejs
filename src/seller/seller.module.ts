import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { TicketModule } from 'src/ticket/ticket.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({
  controllers: [SellerController],
  providers: [SellerService],
  imports: [
    UserModule,
    EmailModule,
    TypeOrmModule.forFeature([User, Ticket]),
    StripeModule,
    TicketModule,
  ],
  exports: [SellerService],
})
export class SellerModule {}
