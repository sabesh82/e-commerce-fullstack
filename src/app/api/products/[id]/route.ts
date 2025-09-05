import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/schema";
import handleError from "@/helpers/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PRODUCT_NOT_FOUND",
            message: "Product not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return handleError(error, "Failed to fetch product details");
  }
}
