import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentMethodId: string;

  @ManyToOne(() => User, (userId: User) => userId.cards)
  userId: User;
}
