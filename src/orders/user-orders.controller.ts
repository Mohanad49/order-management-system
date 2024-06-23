import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('api/users')
export class UserOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':userId/orders')
  async getUserOrders(@Param('userId') userId: number) {
    return this.ordersService.getOrderHistory(userId);
  }
}
