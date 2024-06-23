import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      address: '123 Main St',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password',
      address: '456 Elm St',
    },
  });

  // Create Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Product 1',
      description: 'Description of Product 1',
      price: 100,
      stock: 50,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Product 2',
      description: 'Description of Product 2',
      price: 200,
      stock: 30,
    },
  });

  // Create Carts
  const cart1 = await prisma.cart.create({
    data: {
      userId: user1.userId,
      CartItem: {
        create: [
          { productId: product1.productId, quantity: 2 },
          { productId: product2.productId, quantity: 1 },
        ],
      },
    },
    include: { CartItem: true },
  });

  const cart2 = await prisma.cart.create({
    data: {
      userId: user2.userId,
      CartItem: {
        create: [{ productId: product1.productId, quantity: 3 }],
      },
    },
    include: { CartItem: true },
  });

  // Create Coupons
  await prisma.coupon.create({
    data: {
      code: 'DISCOUNT10',
      discount: 10,
      validUntil: new Date('2024-12-31'),
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'DISCOUNT20',
      discount: 20,
      validUntil: new Date('2024-12-31'),
    },
  });

  console.log('Database has been seeded with dummy data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
