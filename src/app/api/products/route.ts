import handleError from "@/helpers/handleError";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/schema";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const category = url.searchParams.get("category");

    const skip = (page - 1) * limit;

    const filters: any = {};
    if (category && category !== "All") {
      filters["variants"] = { path: ["sizes"], array_contains: [category] };
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: filters,
        skip,
        take: limit,
      }),
      prisma.product.count({ where: filters }),
    ]);

    return NextResponse.json(
      { success: true, items: products, total },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Failed to fetch products");
  }
}
