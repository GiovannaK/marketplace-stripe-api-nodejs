import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { Status } from './status/status.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ nullable: true, type: 'float' })
  total: number;

  @ManyToOne(() => Ticket, (ticketOrder: Ticket) => ticketOrder.orderTicket, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  ticketsOrder: Ticket;

  @ManyToOne(() => User, (sellerId: User) => sellerId.tickets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sellerId: User;

  @ManyToOne(() => User, (customerId: User) => customerId.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  customerId: User;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CREATED,
  })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
