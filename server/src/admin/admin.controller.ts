import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../database/entities';
import { AdminService } from './admin.service';
import { UpdateOrderStatusDto } from './dto';

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

  @Get('orders')
  orders() {
    return this.admin.orders();
  }

  @Patch('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.admin.updateOrderStatus(id, dto);
  }
}
