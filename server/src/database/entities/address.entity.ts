import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 160 })
  receiverName: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 255 })
  line1: string;

  @Column({ length: 120 })
  city: string;

  @Column({ length: 120 })
  district: string;

  @Column({ default: false })
  isDefault: boolean;
}
