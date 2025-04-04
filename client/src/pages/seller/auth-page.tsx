import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { TikTokShopIcon } from "@/components/ui/tiktok-logo";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập" }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
  remember: z.boolean().optional(),
});

// Register form schema
const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" })
    .max(50),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  confirmPassword: z.string(),
  fullName: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Số điện thoại không hợp lệ" })
    .optional(),
  referralCode: z.string().optional(),
  becomeASeller: z.boolean().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản dịch vụ",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
      referralCode: "",
      becomeASeller: false,
      acceptTerms: false,
    },
  });

  // Handle login submit
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  // Handle register submit
  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Omit confirmPassword and acceptTerms fields
    const { confirmPassword, acceptTerms, ...registerData } = data;
    
    // If not becoming a seller, remove the referralCode to avoid sending empty string
    if (!registerData.becomeASeller) {
      delete registerData.referralCode;
    }
    
    // Log for debugging
    console.log("Sending registration data:", registerData);
    
    registerMutation.mutate(registerData);
  };

  if (user) {
    return null; // Will redirect
  }

  return (
    <Layout hideFooter>
      <div className="min-h-screen py-10 flex flex-col lg:flex-row items-center justify-center gap-8 px-4">
        {/* Hero Section */}
        <div className="lg:w-1/2 max-w-2xl text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <TikTokShopIcon className="h-12 w-12 text-primary" size={48} />
            <span className="ml-2 text-3xl font-bold">TikTok Shop</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Chào mừng đến với <span className="text-primary">TikTok Shop</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Nền tảng thương mại điện tử uy tín hàng đầu Việt Nam với hàng triệu
            sản phẩm chất lượng cao. Mua sắm dễ dàng, thanh toán an toàn, giao
            hàng nhanh chóng.
          </p>
          <div className="hidden lg:flex flex-wrap gap-4">
            <div className="bg-card border border-border rounded-lg p-6 w-full md:w-64">
              <div className="text-4xl font-bold text-primary mb-2">1M+</div>
              <div className="text-muted-foreground">Người dùng tin tưởng</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 w-full md:w-64">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Sản phẩm đa dạng</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 w-full md:w-64">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="w-full lg:w-1/2 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {activeTab === "login" ? "Đăng nhập" : "Đăng ký"}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login"
                  ? "Đăng nhập vào tài khoản của bạn"
                  : "Tạo tài khoản mới để mua sắm"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                  <TabsTrigger value="register">Đăng ký</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên đăng nhập"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between">
                        <FormField
                          control={loginForm.control}
                          name="remember"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                                Ghi nhớ đăng nhập
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <a
                          href="#"
                          className="text-sm text-primary hover:underline"
                        >
                          Quên mật khẩu?
                        </a>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Đăng nhập
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form
                      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên đăng nhập"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Nhập email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mật khẩu</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Nhập mật khẩu"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Xác nhận mật khẩu</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Xác nhận mật khẩu"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên (không bắt buộc)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập họ và tên của bạn"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại (không bắt buộc)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập số điện thoại"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4 p-4 border border-border rounded-md bg-muted/20 mt-2">
                        <h3 className="font-medium text-primary">Trở thành người bán hàng</h3>
                        
                        <FormField
                          control={registerForm.control}
                          name="becomeASeller"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium cursor-pointer">
                                  Đăng ký trở thành người bán hàng trên TikTok Shop
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  Bạn sẽ có thể đăng bán sản phẩm và nhận đơn hàng từ khách hàng
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        {registerForm.watch("becomeASeller") && (
                          <FormField
                            control={registerForm.control}
                            name="referralCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mã giới thiệu</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập mã giới thiệu (nếu có)"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                                <p className="text-xs text-muted-foreground">
                                  Nếu bạn được giới thiệu bởi người bán hàng khác, hãy nhập mã giới thiệu của họ để nhận ưu đãi đặc biệt.
                                </p>
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                      
                      <FormField
                        control={registerForm.control}
                        name="acceptTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                                Tôi đồng ý với{" "}
                                <a
                                  href="#"
                                  className="text-primary hover:underline"
                                >
                                  điều khoản sử dụng
                                </a>{" "}
                                và{" "}
                                <a
                                  href="#"
                                  className="text-primary hover:underline"
                                >
                                  chính sách bảo mật
                                </a>
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Đăng ký
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Hoặc đăng nhập với
                  </span>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" className="w-full">
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  Facebook
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
