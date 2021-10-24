import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { StripeService } from 'src/stripe/stripe.service';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Role } from 'src/user/entities/role/role.enum';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly striperService: StripeService,
  ) {}

  async createSeller(createUserDto: CreateUserDto) {
    await this.userService.isEmailAlreadyExists(createUserDto.email);
    const loginToken = this.userService.generateLoginToken();
    const expirationLoginToken = String(
      this.userService.generateLoginTokenExpiration(),
    );

    const user = await this.userRepository.create({
      ...createUserDto,
      loginToken,
      role: Role.SELLER,
      expirationLoginToken,
    });

    const createdUser = await this.userRepository.save(user);

    if (!createdUser) {
      throw new InternalServerErrorException('Seller could not be created');
    }

    const stripe = await this.striperService.createSellerStripe(
      createdUser.email,
    );

    const subject = 'Ticketfy: Faça login para continuar';
    const text = `Sua conta foi criada com sucesso, clique no link para fazer login: \n
      ${user.loginToken}
    `;

    await this.emailService.sendEmail(user.email, subject, text);

    return {
      user: createdUser,
      account: stripe.account.id,
    };
  }
}
