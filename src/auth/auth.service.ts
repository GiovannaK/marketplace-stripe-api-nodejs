import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyTokenExpiration(expirationLoginToken: string) {
    const expirationLoginTokenToNumber = Number(expirationLoginToken);
    const now = Date.now();
    if (now > expirationLoginTokenToNumber) {
      throw new BadRequestException('Token expired');
    }
    return;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.findUserByEmail(loginDto.email);
    const loginToken = this.userService.generateLoginToken();
    const expirationLoginToken = String(
      this.userService.generateLoginTokenExpiration(),
    );

    await this.userRepository.update(user, {
      loginToken,
      expirationLoginToken,
    });

    const updatedUser = await this.userRepository.create({
      ...user,
      loginToken,
      expirationLoginToken,
    });

    await this.userRepository.save(updatedUser);

    const subject = 'Ticketfy: Faça login para continuar';
    const text = `clique no link para fazer login: \n
      ${process.env.CLIENT_URL}/auth/${updatedUser.loginToken}
    `;

    await this.emailService.sendEmail(user.email, subject, text);

    return updatedUser;
  }

  async validateUser(authToken: string) {
    const user = await this.userRepository.findOne({
      where: { loginToken: authToken },
    });

    if (!user) {
      throw new NotFoundException('Cannot found user');
    }

    await this.verifyTokenExpiration(user.expirationLoginToken);

    await this.userRepository.update(user, {
      loginToken: null,
      expirationLoginToken: null,
    });

    const updatedUser = await this.userRepository.create({
      ...user,
      loginToken: null,
      expirationLoginToken: null,
    });

    const token = await this.jwtToken(user);

    return {
      updatedUser,
      token,
    };
  }
  private async jwtToken(user: User) {
    const payload = { role: user.role, sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }
}
