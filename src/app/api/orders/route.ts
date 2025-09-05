import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import privateRoute from "@/helpers/privateRoute";
import handleError from "@/helpers/handleError";

const prisma = new PrismaClient();

// Type for cart items
type CartItemType = Pick<
  Awaited<ReturnType<typeof prisma.cartItem.findMany>>[number],
  "id" | "productId" | "quantity"
>;

// Create order from cart
export async function POST(request: NextRequest) {
  return privateRoute(request, async (user) => {
    try {
      // Fetch user's cart items that are not yet part of an order
      const cartItems: CartItemType[] = await prisma.cartItem.findMany({
        where: { userId: user.id, orderId: null },
      });

      if (!cartItems.length) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "CART_EMPTY", message: "No items in cart" },
          },
          { status: 400 }
        );
      }

      // Calculate total
      let total: number = 0;
      for (const item of cartItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) continue;
        total += product.price * item.quantity;
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          total,
          status: "pending",
        },
      });

      // Update cart items to link them to this order
      await prisma.cartItem.updateMany({
        where: { id: { in: cartItems.map((item) => item.id) } },
        data: { orderId: order.id },
      });

      return NextResponse.json({ success: true, data: order }, { status: 200 });
    } catch (error) {
      return handleError(error, "Failed to create order");
    }
  });
}
