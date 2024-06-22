// coupons/coupons.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async applyCoupon(orderId: number, couponDto: CouponDto) {
    const { code } = couponDto;

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
        status: 'Discount Applied', // Update status as per your logic
        discount: discountAmount,
      },
    });

    return updatedOrder;
  }
}
