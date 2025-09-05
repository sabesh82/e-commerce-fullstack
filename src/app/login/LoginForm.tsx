"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema } from "@/schemas/user.schema";
import { useApi } from "@/providers/apiProvider";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { cookieKeys } from "@/config/cookies.config";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import toast from "react-hot-toast";
import { UserLoginInput } from "../api/auth/login/type";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserLoginInput>({
    mode: "onSubmit",
    resolver: zodResolver(userLoginSchema),
    shouldFocusError: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { apiClient } = useApi();
  const router = useRouter();

  return (
    <form
      onSubmit={handleSubmit(async (userData) => {
        try {
          setIsLoading(true);
          const { data: user } = await apiClient.post("auth/login", userData);
          const token = user.token;

          Cookie.set(cookieKeys.USER_TOKEN, token);
          console.log({ user });
          reset();

          router.push("/explore");
        } catch (error: any) {
          const message =
            error?.response?.data?.error?.message ||
            "Failed to login. Check email or password.";
          toast.error(message);
        } finally {
          setIsLoading(false);
        }
      })}
      className="w-full"
    >
      <div className="flex flex-col items-center justify-center">
        {/*heading section*/}
        <div className="flex flex-col gap-1 mb-7 ">
          <h1 className="text-gray-900 font-semibold text-3xl md:text-4xl text-center">
            Welcome Back
          </h1>
          <p className="text-sm text-center text-gray-500">
            Enter your email & password to access your account
          </p>
        </div>

        <div className="w-full max-w-sm space-y-2">
          {/*email*/}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-gray-900 mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="enter the email"
              className={`p-[0.35rem] pl-2 bg-white border-1 border-gray-400 text-md rounded-md outline-none placeholder:text-sm ${
                errors.email
                  ? "border-red-500 focus:ring-1 focus:ring-red-500 "
                  : "border-gray-400 focus:ring-2 focus:ring-indigo-900 "
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-[0.7rem]">
                {errors.email.message}
              </p>
            )}
          </div>

          {/*password*/}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-gray-900 mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="enter the password"
              className={`p-[0.35rem] pl-2 bg-white border-1 border-gray-400 text-md rounded-md outline-none placeholder:text-sm ${
                errors.password
                  ? "border-red-500 focus:ring-1 focus:ring-red-500 "
                  : "border-gray-400 focus:ring-2 focus:ring-indigo-900 "
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-[0.7rem]">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 px-2 py-[0.415rem] text-white  border-1 border-gray-300 bg-indigo-600 rounded-md hover:-translate-y-0.5 cursor-pointer"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          {/*seperation line*/}
          <div className="flex items-center mt-1.5">
            <hr className="flex-grow border-t border-gray-300" />
            <p className="px-3 text-xs text-gray-500">Or Login With</p>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/*login buttons*/}
          <div className="w-full flex items-center space-x-2 mt-2.5">
            <button className="flex items-center justify-center gap-2 w-1/2 bg-gray-100 p-1 rounded-md hover:scale-102 cursor-pointer">
              <FcGoogle />
              <p>Google</p>
            </button>
            <button className="flex items-center justify-center gap-2 w-1/2 bg-gray-100 p-1 rounded-md hover:scale-102 cursor-pointer">
              <FaApple />
              <p>Apple</p>
            </button>
          </div>

          <div className="flex justify-center mb-12">
            <p className="text-xs text-gray-500">
              Don&apos;t Have An Account?{" "}
              <span className="text-blue-500 cursor-pointer">
                <a onClick={() => router.push("/sign-up")}>Register Now</a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
