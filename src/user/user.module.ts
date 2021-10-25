import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from 'src/stripe/stripe.module';
import { EmailModule } from '../email/email.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [EmailModule, TypeOrmModule.forFeature([User]), StripeModule],
  exports: [UserService],
})
export class UserModule {}
