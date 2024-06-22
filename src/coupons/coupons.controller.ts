import { Controller, Post, Body, Param } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponDto } from './dto/coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post(':orderId/apply')
  async applyCoupon(
    @Param('orderId') orderId: number,
    @Body() couponDto: CouponDto,
  ) {
    return this.couponsService.applyCoupon(orderId, couponDto);
  }
}
