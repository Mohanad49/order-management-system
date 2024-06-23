import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserOrdersController } from './user-orders.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController, UserOrdersController],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
