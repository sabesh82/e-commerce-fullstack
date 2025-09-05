"use client";

import { AxiosInstance } from "axios";
import { createContext, ReactNode, useContext } from "react";
import Cookie from "js-cookie";
import { cookieKeys } from "@/config/cookies.config";
import createApiClient from "@/helpers/baseApi";

interface IAxiosContext {
  apiClient: AxiosInstance;
}

const ApiContext = createContext<IAxiosContext | null>(null);

const ApiProvider = ({ children }: { children: ReactNode }) => {
  const getToken = () => {
    return Cookie.get(cookieKeys.USER_TOKEN) || null;
  };
  const apiClient = createApiClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    getToken: getToken,
    logout: () => {},
  });

  return (
    <ApiContext.Provider value={{ apiClient }}>{children}</ApiContext.Provider>
  );
};

const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useAPI must be used within an APIProvider");
  }

  return context;
};

export { ApiProvider, useApi };
