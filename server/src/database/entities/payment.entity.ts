import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @Column({ length: 60 })
  provider: string;

  @Column({ type: 'enum', enum: PaymentStatus, enumName: 'payment_status', default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string;

  @CreateDateColumn()
  createdAt: Date;
}
