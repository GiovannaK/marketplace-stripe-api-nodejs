import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  providers: [StripeService],
  imports: [AuthModule, TypeOrmModule.forFeature([User]), UserModule],
  exports: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
