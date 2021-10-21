/* eslint-disable @typescript-eslint/no-var-requires */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
const crypto = require('crypto');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  generateLoginToken() {
    const createToken = crypto.randomBytes(20).toString('hex');
    return createToken;
  }

  generateLoginTokenExpiration() {
    // expires in 10 min
    const generateExpiration = Date.now() + 10 * (60 * 1000);
    return generateExpiration;
  }

  async isEmailAlreadyExists(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      throw new BadRequestException('Email already in use');
    }
    return;
  }

  async createUser(createUserDto: CreateUserDto) {
    await this.isEmailAlreadyExists(createUserDto.email);
    const loginToken = this.generateLoginToken();
    const expirationLoginToken = String(this.generateLoginTokenExpiration());

    const user = await this.userRepository.create({
      ...createUserDto,
      loginToken,
      expirationLoginToken,
    });

    const createdUser = await this.userRepository.save(user);

    if (!createdUser) {
      throw new InternalServerErrorException('User could not be created');
    }

    const subject = 'Ticketfy: Faça login para continuar';
    const text = `Sua conta foi criada com sucesso, clique no link para fazer login: \n
      ${user.loginToken}
    `;

    await this.emailService.sendEmail(user.email, subject, text);

    return createdUser;
  }
}
