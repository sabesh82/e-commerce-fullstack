import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/schema";
import handleError from "@/helpers/handleError";
import privateRoute from "@/helpers/privateRoute";

export async function GET(request: NextRequest) {
  return privateRoute(request, async (user) => {
    try {
      const items = await prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { product: true },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(
        {
          success: true,
          data: { items, total: items.length },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error, "Failed to fetch cart items");
    }
  });
}

export async function POST(request: NextRequest) {
  return privateRoute(request, async (user) => {
    try {
      const body = await request.json();
      const { productId, quantity = 1, selectedSize, selectedColor } = body;

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "PRODUCT_NOT_FOUND", message: "Product not found" },
          },
          { status: 404 }
        );
      }

      const existing = await prisma.cartItem.findFirst({
        where: { userId: user.id, productId, orderId: null },
      });

      const cartItem = existing
        ? await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + quantity },
          })
        : await prisma.cartItem.create({
            data: {
              userId: user.id,
              productId,
              quantity,
              selectedSize,
              selectedColor,
            },
          });

      return NextResponse.json(
        { success: true, data: cartItem },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error, "Failed to add item to cart");
    }
  });
}

export async function DELETE(request: NextRequest) {
  return privateRoute(request, async (user) => {
    try {
      const url = new URL(request.url);
      const cartItemId = url.searchParams.get("cartItemId");

      if (!cartItemId) {
        return NextResponse.json(
          { success: false, error: "cartItemId is required" },
          { status: 400 }
        );
      }

      const existingItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
      });

      if (
        !existingItem ||
        existingItem.userId !== user.id ||
        existingItem.orderId
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Cart item not found or cannot be deleted",
          },
          { status: 404 }
        );
      }

      await prisma.cartItem.delete({ where: { id: cartItemId } });

      return NextResponse.json(
        { success: true, data: { message: "Cart item deleted successfully" } },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error, "Failed to delete cart item");
    }
  });
}
