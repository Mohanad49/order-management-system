import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CouponDto } from './dto/coupon.dto';

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
    const parsedOrderId = parseInt(orderId.toString(), 10);
    const order = await this.prisma.order.findUnique({
      where: { orderId: parsedOrderId },
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
    const parsedOrderId = parseInt(orderId.toString(), 10);

    const order = await this.prisma.order.findUnique({
      where: { orderId: parsedOrderId },
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
    const parsedUserId = parseInt(userId.toString(), 10);
    return this.prisma.order.findMany({
      where: { userId: parsedUserId },
      include: { OrderItem: { include: { product: true } } },
    });
  }
  async applyCoupon(couponDto: CouponDto) {
    const { orderId, code } = couponDto;

    // Find the order by orderId
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: { OrderItem: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Find the coupon by code
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    // Check if the coupon is still valid
    if (coupon.validUntil < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }

    // Calculate the discount and update the order
    const discountAmount = order.OrderItem.reduce((total, item) => {
      return (
        total + item.quantity * item.product.price * (coupon.discount / 100)
      );
    }, 0);

    const updatedOrder = await this.prisma.order.update({
      where: { orderId },
      data: {
        status: 'Discount Applied',
        discount: discountAmount,
      },
    });

    return updatedOrder;
  }
}
