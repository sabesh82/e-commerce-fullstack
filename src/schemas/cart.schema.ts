import { z } from "zod";

// Schema for adding an item to cart
export const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).optional(),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
});

// Schema for updating a cart item
export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).optional(),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
});
