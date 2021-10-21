import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { AuthModule } from './auth/auth.module';
import { SellerModule } from './seller/seller.module';
import { StripeModule } from './stripe/stripe.module';
import { TicketModule } from './ticket/ticket.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    EmailModule,
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
    AuthModule,
    SellerModule,
    StripeModule,
    TicketModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
