import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/schema";
import privateRoute from "@/helpers/privateRoute";
import handleError from "@/helpers/handleError";
import { updateCartItemSchema } from "@/schemas/cart.schema";

export async function PATCH(request: NextRequest) {
  return privateRoute(request, async (user) => {
    try {
      const url = new URL(request.url);
      const cartItemId = url.searchParams.get("cartItemId");
      const body = await request.json();
      const { quantity } = body;

      if (!cartItemId || quantity < 1) {
        return NextResponse.json(
          { success: false, error: "Invalid data" },
          { status: 400 }
        );
      }

      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
      });

      if (!cartItem || cartItem.userId !== user.id) {
        return NextResponse.json(
          { success: false, error: "Cart item not found" },
          { status: 404 }
        );
      }

      const updated = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });

      return NextResponse.json(
        { success: true, data: updated },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error, "Failed to update cart item");
    }
  });
}
