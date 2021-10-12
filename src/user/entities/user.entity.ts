import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Bank } from './bank.entity';
import { Card } from './card.entity';
import { Role } from './role/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  fullName: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    nullable: true,
  })
  loginToken: string;

  @Column({
    nullable: true,
  })
  expirationLoginToken: string;

  @Column({
    nullable: true,
  })
  stripeCustomerId: string;

  @Column({
    nullable: true,
  })
  stripeAccountId: string;

  @OneToMany(() => Bank, (bank: Bank) => bank.userId)
  banks: Bank[];

  @OneToMany(() => Card, (card: Card) => card.userId)
  cards: Card[];
}
