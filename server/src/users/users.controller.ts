import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '../common/roles.decorator';
import { User, UserRole } from '../database/entities';

@Controller('users')
export class UsersController {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.users.find({
      select: ['id', 'fullName', 'email', 'role', 'phone', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }
}
