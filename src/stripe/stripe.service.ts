import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET, {
      apiVersion: '2020-08-27',
    });
  }

  async createSellerStripe(email: string) {
    const user = await this.authService.findUserByEmail(email);
    const account = await this.stripe.accounts.create({
      type: 'express',
      country: 'BR',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    if (!account) {
      throw new InternalServerErrorException(
        'Cannot create stripe account for this seller',
      );
    }

    await this.userRepository.update(user, {
      stripeAccountId: account.id,
    });

    const updatedSeller = await this.userRepository.create({
      ...user,
      stripeAccountId: account.id,
    });

    return {
      user: updatedSeller,
      account,
    };
  }
}
