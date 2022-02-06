import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET, {
      apiVersion: '2020-08-27',
    });
  }

  public async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  async createSellerStripe(createdUser: User) {
    const account = await this.stripe.accounts.create({
      type: 'express',
      country: 'BR',
      email: createdUser.email,
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

    await this.userRepository.update(createdUser, {
      stripeAccountId: account.id,
    });

    const updatedSeller = await this.userRepository.create({
      ...createdUser,
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
      return_url: `${process.env.FRONTEND_URL}/seller`,
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

  async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  async charge(
    amount: number,
    paymentMethodId: string,
    customerId: any,
    sellerId: any,
    orderId: any,
  ) {
    const payment = await this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      payment_method: paymentMethodId,
      currency: 'BRL',
      confirm: true,
      metadata: {
        orderId: orderId,
      },
      transfer_data: {
        destination: sellerId.stripeAccountId,
      },
    });

    return payment;
  }
}
