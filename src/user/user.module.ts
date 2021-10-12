import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [EmailService],
})
export class UserModule {}
