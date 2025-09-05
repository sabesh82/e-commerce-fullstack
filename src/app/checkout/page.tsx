"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/providers/apiProvider";
import toast from "react-hot-toast";
import { LuClock } from "react-icons/lu";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
  };
}

export default function CheckoutPage() {
  const { apiClient } = useApi();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");

  const DELIVERY_PRICE = 5;

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await apiClient.get("cart");
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

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemsTotalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );
  const finalTotal = itemsTotalPrice + DELIVERY_PRICE;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8e4306]"></div>
      </div>
    );

  return (
    <section className="w-full min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* Address */}
        <label className="block mb-2 text-lg font-medium text-gray-700">
          Delivery Address
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e4306] focus:outline-none"
          rows={4}
        />
        <div className="mt-1 flex items-center gap-1">
          <LuClock />
          <p className="text-gray-800">Delivered in the next 7 days</p>
        </div>

        {/* Payment method */}
        <div className="mt-5">
          <p>Payment method</p>
          <div className="flex flex-wrap gap-2.5 mt-2">
            <img
              src="/visa.png"
              alt="Visa"
              className="w-10 h-7 sm:w-20 sm:h-16 object-cover rounded-2xl"
            />
            <img
              src="/paypal.png"
              alt="Paypal"
              className="w-10 h-7 sm:w-20 sm:h-16 object-cover rounded-2xl"
            />
            <img
              src="/card.png"
              alt="Card"
              className="w-10 h-7 sm:w-20 sm:h-16 object-cover rounded-2xl"
            />
            <img
              src="/apple-pay.png"
              alt="Apple Pay"
              className="w-10 h-7 sm:w-20 sm:h-16 object-cover rounded-2xl"
            />
            <img
              src="/symbol.png"
              alt="Symbol"
              className="w-10 h-7 sm:w-20 sm:h-16 object-cover rounded-2xl"
            />
          </div>

          <p className="mt-4 text-xs md:text-sm">
            Note: Use your order id at the payment. Your Id #154619. If you
            forget to put your order id we can’t confirm the payment.
          </p>
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-2 text-lg">
          <p>Total items: {totalItems}</p>
          <p>Delivery: ${DELIVERY_PRICE.toFixed(2)}</p>
          <p className="font-bold text-xl">
            Grand Total: ${finalTotal.toFixed(2)}
          </p>
        </div>

        {/* Place order button */}
        <button
          onClick={() => toast.success("Order placed! (address not saved yet)")}
          className="mt-6 w-full bg-[#e6ab7b] hover:bg-[#b48966] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          Place Order
        </button>
      </div>
    </section>
  );
}
