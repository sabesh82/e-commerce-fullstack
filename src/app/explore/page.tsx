"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/providers/apiProvider";
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";
import { IoBagHandleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
}

export default function ExplorePage() {
  const { apiClient } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/products");
        const formatted: Product[] = response.data.items.map((p: unknown) => {
          const item = p as Product;
          return {
            id: item.id,
            title: item.title,
            price: item.price,
            images: item.images,
            category: item.category,
          };
        });
        setProducts(formatted);
        setFilteredProducts(formatted);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(formatted.map((p) => p.category).filter(Boolean))
        ) as string[];
        setCategories(["All", ...uniqueCategories]);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiClient]);

  // Handle category change
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (!products.length)
    return <p className="text-center mt-10">No products available.</p>;

  return (
    <section className="w-full min-h-screen p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold ">Explore</h1>
          <p className="mb-6 text-gray-500">Best trendy collection</p>
        </div>
        <div
          className="flex items-center gap-1 border-1 p-1.5 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200"
          onClick={() => router.push("/cart")}
        >
          <IoBagHandleOutline />
          <button>View cart</button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`flex-shrink-0 px-4 py-1 rounded-full border whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-orange-400 border-[#8e4306]"
                : "bg-white border-gray-300"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
