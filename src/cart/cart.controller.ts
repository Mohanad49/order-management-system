import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveCartDto } from './dto/remove-cart.dto';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.addToCart(createCartDto);
  }

  @Get(':userId')
  viewCart(@Param('userId') userId: string) {
    return this.cartService.viewCart(+userId);
  }

  @Put('update')
  updateCart(@Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(updateCartDto);
  }

  @Delete('remove')
  removeFromCart(@Body() removeCartDto: RemoveCartDto) {
    return this.cartService.removeFromCart(removeCartDto);
  }
}
