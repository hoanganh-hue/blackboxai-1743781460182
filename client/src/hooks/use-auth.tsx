import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser, USER_ROLES } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/lib/constants";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  isAdmin: boolean;
  isSeller: boolean;
  isCustomer: boolean;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: [API_ENDPOINTS.AUTH.USER],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", API_ENDPOINTS.AUTH.LOGIN, credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData([API_ENDPOINTS.AUTH.USER], user);
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng trở lại, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Tên đăng nhập hoặc mật khẩu không đúng",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest("POST", API_ENDPOINTS.AUTH.REGISTER, userData);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData([API_ENDPOINTS.AUTH.USER], user);
      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo thành công",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Đã có lỗi xảy ra khi đăng ký tài khoản",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", API_ENDPOINTS.AUTH.LOGOUT);
    },
    onSuccess: () => {
      queryClient.setQueryData([API_ENDPOINTS.AUTH.USER], null);
      toast({
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại bạn lần sau!",
      });
      // Invalidate all queries to ensure fresh data on login
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast({
        title: "Đăng xuất thất bại",
        description: error.message || "Đã có lỗi xảy ra khi đăng xuất",
        variant: "destructive",
      });
    },
  });

  const isAdmin = !!user && user.role === USER_ROLES.ADMIN;
  const isSeller = !!user && (user.role === USER_ROLES.SELLER || user.role === USER_ROLES.ADMIN);
  const isCustomer = !!user;

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        isAdmin,
        isSeller,
        isCustomer,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
