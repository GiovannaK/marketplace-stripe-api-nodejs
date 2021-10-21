import { Order } from 'src/ticket/entities/order.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.sellerId)
  tickets: Ticket[];

  @OneToMany(() => Order, (order: Order) => order.customerId)
  order: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
