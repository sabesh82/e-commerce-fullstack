import axios, { AxiosError, CreateAxiosDefaults, ResponseType } from "axios";

type method = "post" | "get" | "put" | "patch" | "delete";

const createApiClient = ({
  baseURL,
  method,
  resposneType,
  headers,
  getToken,
  logout,
  options,
}: {
  baseURL: string;
  method?: method;
  resposneType?: ResponseType;
  headers?: CreateAxiosDefaults["headers"];
  getToken: () => string | null;
  logout: () => void;
  options?: Omit<
    CreateAxiosDefaults,
    "baseUrl" | "responseType" | "method" | "headers"
  >;
}) => {
  const apiClient = axios.create({
    baseURL: baseURL,
    method: method,
    headers: headers ?? { "Content-Type": "application/json" },
    responseType: resposneType,
    ...options,
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (respose) => respose,

    (error: AxiosError) => {
      const status = error.response?.status;

      if (status === 401) {
        logout();
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default createApiClient;
