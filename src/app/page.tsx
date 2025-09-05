"use client";
import React from "react";
import onboarding from "../../public/onboarding.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <section className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side */}
      <div className="p-2 flex justify-center items-center">
        <Image
          src={onboarding}
          alt="Onboarding"
          className="rounded-2xl md:block object-cover w-full h-full"
          priority
        />
      </div>

      {/* Right side */}
      <div className="flex flex-col justify-center items-center md:items-start w-full p-6 md:p-12 ml-0 md:ml-10">
        <div className="text-center md:text-left max-w-md">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Find The Best Collections
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
            Get your dream item easily with FashionHub and enjoy other exciting
            offers.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <button
              className="px-6 py-2 border rounded-3xl w-full sm:w-auto cursor-pointer hover:bg-gray-100"
              onClick={() => router.push("/sign-up")}
            >
              Sign-Up
            </button>
            <button
              className="px-6 py-2 border rounded-3xl bg-orange-400 text-white border-orange-400 w-full sm:w-auto cursor-pointer hover:bg-orange-500"
              onClick={() => router.push("/login")}
            >
              Sign-In
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
