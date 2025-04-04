import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute, AdminRoute, SellerRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

// Pages
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CategoryPage from "@/pages/category-page";
import CategoriesPage from "@/pages/categories-page";
import CartPage from "@/pages/cart-page";

// Seller Pages
import SellerDashboardPage from "@/pages/seller/dashboard";
import SellerRegisterPage from "@/pages/seller/register";
import SellerProductsPage from "@/pages/seller/products";
import SellerProductFormPage from "@/pages/seller/product-form";
import ProductPriceEditPage from "@/pages/seller/price-edit";
import SellerProfilePage from "@/pages/seller/profile";
import SellerWalletPage from "@/pages/seller/wallet";
import SellerOrdersPage from "@/pages/seller/orders";
import SellerSettingsPage from "@/pages/seller/settings";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminUsersPage from "@/pages/admin/users";
import AdminCategoriesPage from "@/pages/admin/categories";
import AdminSampleStorePage from "@/pages/admin/sample-store";
import AdminProductApprovalPage from "@/pages/admin/product-approval";
import AdminWithdrawalsPage from "@/pages/admin/withdrawals";
import AdminBotsPage from "@/pages/admin/bots";
import UpdateIconsPage from "@/pages/admin/update-icons";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/product/:slug" component={ProductDetailPage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/categories" component={CategoriesPage} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/cart" component={CartPage} />

      {/* Seller Routes */}
      <Route path="/seller/register" component={SellerRegisterPage} />
      <SellerRoute path="/seller/dashboard" component={SellerDashboardPage} />
      <SellerRoute path="/seller/products" component={SellerProductsPage} />
      <SellerRoute path="/seller/products/create" component={SellerProductFormPage} />
      <SellerRoute path="/seller/products/edit/:id" component={SellerProductFormPage} />
      <SellerRoute path="/seller/products/price/:id" component={ProductPriceEditPage} />
      <SellerRoute path="/seller/profile" component={SellerProfilePage} />
      <SellerRoute path="/seller/wallet" component={SellerWalletPage} />
      <SellerRoute path="/seller/orders" component={SellerOrdersPage} />
      <SellerRoute path="/seller/settings" component={SellerSettingsPage} />
      
      {/* Admin Routes */}
      <AdminRoute path="/admin/dashboard" component={AdminDashboardPage} />
      <AdminRoute path="/admin/users" component={AdminUsersPage} />
      <AdminRoute path="/admin/categories" component={AdminCategoriesPage} />
      <AdminRoute path="/admin/sample-store" component={AdminSampleStorePage} />
      <AdminRoute path="/admin/product-approval" component={AdminProductApprovalPage} />
      <AdminRoute path="/admin/withdrawals" component={AdminWithdrawalsPage} />
      <AdminRoute path="/admin/bots" component={AdminBotsPage} />
      <AdminRoute path="/admin/update-icons" component={UpdateIconsPage} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminQuickAccess() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) return null;
  
  return (
    <Link href={ROUTES.ADMIN.DASHBOARD}>
      <Button 
        className="fixed bottom-4 right-4 z-50 rounded-full p-3 shadow-lg bg-primary text-primary-foreground"
        size="icon"
      >
        <LayoutDashboard className="h-6 w-6" />
      </Button>
    </Link>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <AdminQuickAccess />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
