import { z } from "zod";

// Schema for creating an order
export const createOrderSchema = z.object({
  cartItemIds: z
    .array(z.string(), { message: "Cart item IDs are required" })
    .nonempty({ message: "At least one cart item is required" }),
});

// Schema for updating order status
export const updateOrderSchema = z.object({
  status: z.enum(["pending", "completed", "cancelled"], {
    message: "Status must be one of: pending, completed, cancelled",
  }),
});
