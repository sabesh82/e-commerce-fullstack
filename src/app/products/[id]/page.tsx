"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/providers/apiProvider";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IoCart, IoChevronBack, IoChevronForward } from "react-icons/io5";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  variants?: {
    sizes?: string[];
    colors?: string[];
  };
  stock: number;
}

export default function ProductDetailPage() {
  const { apiClient } = useApi();
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data.data);

        // Set default variants if available
        if (response.data.data.variants?.sizes) {
          setSelectedSize(response.data.data.variants.sizes[0]);
        }
        if (response.data.data.variants?.colors) {
          setSelectedColor(response.data.data.variants.colors[0]);
        }
      } catch (error: any) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, apiClient]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await apiClient.post("cart", {
        productId: product.id,
        quantity,
        selectedSize,
        selectedColor,
      });
      toast.success(`Added ${product.title} to cart!`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login first to add items to your cart!");
        router.push("/login");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8e4306]"></div>
      </div>
    );
  if (!product)
    return (
      <p className="text-center mt-10 text-xl text-gray-600">
        Product not found
      </p>
    );

  return (
    <section className="w-full min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Product Image Carousel */}
        <div className="flex-1 relative">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg bg-white">
            <img
              src={`/images/${product.images[currentImageIndex]}`}
              alt={`${product.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition"
                >
                  <IoChevronBack className="text-2xl text-[#8e4306]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition"
                >
                  <IoChevronForward className="text-2xl text-[#8e4306]" />
                </button>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? "bg-[#8e4306]" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            {product.title}
          </h1>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Variant Selection */}
          {product.variants?.sizes && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                      selectedSize === size
                        ? "border-[#8e4306] bg-[#e6ab7b] text-white"
                        : "border-gray-300 hover:border-[#8e4306] hover:bg-[#e6ab7b]/10"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variants?.colors && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.variants.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                      selectedColor === color
                        ? "border-[#8e4306] bg-[#e6ab7b] text-white"
                        : "border-gray-300 hover:border-[#8e4306] hover:bg-[#e6ab7b]/10"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 border-2 border-gray-300 rounded-lg hover:border-[#8e4306] transition"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((prev) => Math.min(product.stock, prev + 1))
                }
                className="px-3 py-1 border-2 border-gray-300 rounded-lg hover:border-[#8e4306] transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Price + Add to Cart at bottom */}
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <p className="text-2xl font-semibold text-[#281402]">
              ${product.price.toFixed(2)}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex items-center justify-center gap-2 px-4 py-2  md:px-6 md:py-3 rounded-2xl text-lg font-semibold transition ${
                product.stock === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#e6ab7b] hover:bg-[#b48966] border-2 border-[#8e4306] text-white"
              }`}
            >
              <IoCart className="text-xl" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
