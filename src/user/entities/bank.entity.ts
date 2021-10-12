import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Bank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  currency: string;
  @Column()
  routingNumber: string;
  @Column()
  accountNumber: string;

  @ManyToOne(() => User, (userId: User) => userId.banks)
  userId: User;
}
