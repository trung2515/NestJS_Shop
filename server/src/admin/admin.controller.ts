import { Controller, Get } from '@nestjs/common';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../database/entities';
import { AdminService } from './admin.service';

@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('reports/sales')
  salesReport() {
    return this.admin.salesReport();
  }

  @Get('reports/top-products')
  topProducts() {
    return this.admin.topProducts();
  }

  @Get('reports/low-stock')
  lowStock() {
    return this.admin.lowStock();
  }
}
