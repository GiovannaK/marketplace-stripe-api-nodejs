import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'timestamptz', nullable: false })
  date: Date;

  @Column({ nullable: false })
  hour: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  hasVariation: boolean;

  @Column({ nullable: true, type: 'float' })
  priceStandard: number;

  @Column({ nullable: true, type: 'float' })
  pricePremium: number;

  @Column({ nullable: true, type: 'float' })
  price: number;

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({
    nullable: true,
  })
  latitude: number;

  @Column({
    nullable: true,
  })
  longitude: number;

  @OneToMany(() => Order, (orderTicket: Order) => orderTicket.ticketsOrder, {
    cascade: true,
  })
  orderTicket: Order[];

  @ManyToOne(() => User, (sellerId: User) => sellerId.tickets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sellerId: User;

  @ManyToOne(
    () => Category,
    (ticketCategory: Category) => ticketCategory.categoriesTickets,
    { onDelete: 'CASCADE' },
  )
  ticketCategory: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
