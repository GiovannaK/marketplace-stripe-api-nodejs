import { Order } from '../../order/entities/order.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.sellerId, {
    cascade: true,
  })
  tickets: Ticket[];

  @OneToMany(() => Order, (order: Order) => order.customerId, {
    cascade: true,
  })
  order: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
