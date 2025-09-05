"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/providers/apiProvider";
import toast from "react-hot-toast";
import { IoTrash, IoCart } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

export default function CartPage() {
  const { apiClient } = useApi();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await apiClient.get("cart");
      console.log("Cart API response:", response.data);
      if (response.data.success) {
        setCartItems(response.data.data.items);
      } else {
        toast.error("Failed to load cart items");
      }
    } catch (error) {
      toast.error("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Delete item
  const handleDelete = async (itemId: string) => {
    try {
      const response = await apiClient.delete(`cart`, {
        params: { cartItemId: itemId },
      });

      if (response.data.success) {
        toast.success("Item removed from cart");
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      } else {
        toast.error(response.data.error || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8e4306]"></div>
      </div>
    );

  if (!cartItems.length)
    return (
      <p className="text-center mt-10 text-xl text-gray-600">
        Your cart is empty.
      </p>
    );

  return (
    <section className="w-full min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="flex flex-col gap-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-white rounded-xl shadow-md"
            >
              {/* Product Image */}
              <img
                src={`/images/${item.product.images[0]}`}
                alt={item.product.title}
                className="w-full sm:w-32 h-32 object-cover rounded-lg"
              />

              {/* Product Info */}
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.product.title}
                </h2>
                {item.selectedSize && (
                  <p className="text-gray-600">Size: {item.selectedSize}</p>
                )}
                {item.selectedColor && (
                  <p className="text-gray-600">Color: {item.selectedColor}</p>
                )}
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-lg font-semibold text-[#281402]">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Price & Delete */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <IoTrash size={22} />
                </button>
              </div>
            </div>
          ))}

          {/* Total & Checkout */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-md">
            <p className="text-xl font-semibold text-gray-800">
              Total: ${totalPrice.toFixed(2)}
            </p>
            <button
              className="mt-3 sm:mt-0 bg-[#e6ab7b] hover:bg-[#b48966] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
              onClick={() => router.push("/checkout")}
            >
              <IoCart /> Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
