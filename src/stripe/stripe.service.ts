import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
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

    await this.userRepository.save(updatedSeller);

    return {
      user: updatedSeller,
      account,
    };
  }

  async createAccountLink(request: Request | any) {
    const accountLink = await this.stripe.accountLinks.create({
      account: request.user.stripeAccountId,
      refresh_url: `${process.env.FRONTEND_URL}/reauth`,
      return_url: `${process.env.FRONTEND_URL}/return`,
      type: 'account_onboarding',
    });

    if (!accountLink) {
      throw new InternalServerErrorException(
        'Cannot create an account link for this seller',
      );
    }

    return accountLink;
  }

  async createLoginLink(request: Request | any) {
    const loginLink = await this.stripe.accounts.createLoginLink(
      request.user.stripeAccountId,
    );

    if (!loginLink) {
      throw new InternalServerErrorException(
        'Cannot create a login link for current seller',
      );
    }

    return loginLink;
  }
}
