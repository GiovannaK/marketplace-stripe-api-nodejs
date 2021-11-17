import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  providers: [WebhookService],
  controllers: [WebhookController],
  imports: [StripeModule],
})
export class WebhookModule {}
