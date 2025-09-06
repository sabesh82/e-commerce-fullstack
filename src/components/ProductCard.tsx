"use client";

import Link from "next/link";
import Image from "next/image"; // <-- Use Next.js Image
import React from "react";
import { IoCart } from "react-icons/io5";
import { useApi } from "@/providers/apiProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { apiClient } = useApi();
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      await apiClient.post("/cart", { productId: product.id, quantity: 1 });
      toast.success(`Added ${product.title} to cart!`);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast.error("Please login first to add items to your cart!");
        router.push("/login");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  const imageUrl =
    product.images && product.images.length
      ? `/images/${product.images[0]}`
      : "/images/placeholder.png";

  return (
    <div className="p-3 bg-white flex flex-col rounded-xl shadow-md hover:shadow-lg transition duration-200">
      <Link href={`/products/${product.id}`}>
        <Image
          src={imageUrl}
          alt={product.title}
          width={400} // Set width and height for Next.js Image
          height={400}
          className="h-42 w-full object-cover mb-4 rounded-xl hover:scale-105 transition duration-200 cursor-pointer"
        />
      </Link>
      <p className="text-lg font-semibold">{product.title}</p>
      <p className="text-md text-[#281402] mt-1">${product.price.toFixed(2)}</p>

      <div className="flex mt-3 items-center justify-end">
        <div
          onClick={handleAddToCart}
          className="bg-black text-white p-1 rounded-2xl text-xl  border-2 border-[#8e4306] transition duration-150 cursor-pointer"
          role="button"
          aria-label={`Add ${product.title} to cart`}
        >
          <IoCart />
        </div>
      </div>
    </div>
  );
}
