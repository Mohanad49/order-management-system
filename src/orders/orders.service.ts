import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId, address } = createOrderDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { CartItem: { include: { product: true } } },
    });

    if (!cart || cart.CartItem.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        address,
        orderDate: new Date(),
        status: 'Pending',
        OrderItem: {
          create: cart.CartItem.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Clear the cart after creating the order
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.cartId },
    });

    return order;
  }

  async getOrderById(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: { OrderItem: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(
    orderId: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const { status } = updateOrderStatusDto;

    const order = await this.prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { orderId },
      data: { status },
    });

    return updatedOrder;
  }

  async getOrderHistory(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { OrderItem: true },
    });
  }
}
