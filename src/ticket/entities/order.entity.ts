import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ nullable: true, type: 'float' })
  total: number;

  @ManyToOne(() => Ticket, (ticketOrder: Ticket) => ticketOrder.orderTicket)
  ticketsOrder: Ticket;

  @ManyToOne(() => User, (sellerId: User) => sellerId.tickets)
  sellerId: User;

  @ManyToOne(() => User, (customerId: User) => customerId.order)
  customerId: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
