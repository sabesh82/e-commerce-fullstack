import { z } from "zod";

// Schema for creating a new product
export const createProductSchema = z.object({
  name: z
    .string({ message: "Product name is required" })
    .min(2, { message: "Product name must be at least 2 characters" })
    .max(100, { message: "Product name cannot exceed 100 characters" }),

  description: z
    .string({ message: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description cannot exceed 1000 characters" }),

  price: z
    .number({ message: "Price is required" })
    .positive({ message: "Price must be greater than 0" }),

  imageUrl: z
    .string({ message: "Image URL is required" })
    .url({ message: "Invalid image URL" }),

  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

// Schema for updating an existing product
export const updateProductSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  price: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});
