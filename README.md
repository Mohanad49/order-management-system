# Order Management System

## Description

This is an Order Management System built with NestJS and Prisma, which allows users to manage carts and orders, apply coupons, and retrieve order history. It includes endpoints for adding items to the cart, creating orders, applying discounts, and retrieving user order history.

## Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- PostgreSQL

## Getting Started

### 1. Clone the repository

```bash
git clone <repository_url>
cd order-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a PostgreSQL database and note down the database URL.

### 4. Configure environment variables

Create a `.env` file in the root of the project and add your database URL:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/your-database-name
```

### 5. Generate Prisma Client

Run the following command to generate the Prisma client:

```bash
npx prisma generate
```

### 6. Migrate the database

Run the Prisma migration to set up the database schema:

```bash
npx prisma migrate dev --name init
```

### 7. Seed the database

To seed the database with dummy data, use the following command:

```bash
npx ts-node prisma/seed.ts
```

### 8. Start the server

Run the following command to start the NestJS server:

```bash
npm run start:dev
```

The server will start at `http://localhost:3000`.

## API Endpoints

### Cart Endpoints

- **Add to Cart**
  - **POST** `/api/cart/add`
  - **Body**:
    ```json
    {
      "userId": 1,
      "productId": 1,
      "quantity": 2
    }
    ```

- **Get Cart**
  - **GET** `/api/cart/:userId`

- **Update Cart**
  - **PATCH** `/api/cart/update`
  - **Body**:
    ```json
    {
      "userId": 1,
      "productId": 1,
      "quantity": 3
    }
    ```

- **Remove from Cart**
  - **DELETE** `/api/cart/remove`
  - **Body**:
    ```json
    {
      "userId": 1,
      "productId": 1
    }
    ```

### Order Endpoints

- **Create Order**
  - **POST** `/api/orders`
  - **Body**:
    ```json
    {
      "userId": 1,
      "address": "123 Main St"
    }
    ```

- **Get Order by ID**
  - **GET** `/api/orders/:orderId`

- **Apply Coupon**
  - **POST** `/api/orders/apply-coupon`
  - **Body**:
    ```json
    {
      "orderId": 1,
      "code": "DISCOUNT10"
    }
    ```

- **Get User Order History**
  - **GET** `/api/users/:userId/orders`

## Testing

You can test the endpoints using Postman or any other API client by sending the appropriate requests to the server. Ensure you have seeded the database with the necessary data before testing.

## License

This project is licensed under the MIT License.

---

### Notes

- Ensure your PostgreSQL database is running and accessible.
- Make sure to update the `DATABASE_URL` in the `.env` file with your actual database credentials.
- Use the dummy data provided in the seed file for initial testing.

---
