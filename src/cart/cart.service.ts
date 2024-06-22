import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveCartDto } from './dto/remove-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(createCartDto: CreateCartDto) {
    const { userId, productId, quantity } = createCartDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { CartItem: true },
    });

    const product = await this.prisma.product.findUnique({
      where: { productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new NotFoundException('Insufficient product stock');
    }

    if (!cart) {
      // Create a new cart for the user if not exist
      await this.prisma.cart.create({
        data: {
          userId,
          CartItem: {
            create: {
              productId,
              quantity,
            },
          },
        },
      });
    } else {
      const cartItem = cart.CartItem.find(
        (item) => item.productId === productId,
      );
      if (cartItem) {
        // Update the quantity if the product is already in the cart
        await this.prisma.cartItem.update({
          where: { cartItemId: cartItem.cartItemId },
          data: { quantity: cartItem.quantity + quantity },
        });
      } else {
        // Add the product to the cart
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.cartId,
            productId,
            quantity,
          },
        });
      }
    }

    return { message: 'Product added to cart' };
  }

  async viewCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { CartItem: { include: { product: true } } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async updateCart(updateCartDto: UpdateCartDto) {
    const { userId, productId, quantity } = updateCartDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { CartItem: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.CartItem.find((item) => item.productId === productId);

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.prisma.cartItem.update({
      where: { cartItemId: cartItem.cartItemId },
      data: { quantity },
    });

    return { message: 'Cart updated' };
  }

  async removeFromCart(removeCartDto: RemoveCartDto) {
    const { userId, productId } = removeCartDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { CartItem: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.CartItem.find((item) => item.productId === productId);

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.prisma.cartItem.delete({
      where: { cartItemId: cartItem.cartItemId },
    });

    return { message: 'Product removed from cart' };
  }
}
