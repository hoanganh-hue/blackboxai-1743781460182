import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  CircleDollarSign, 
  User, 
  ChevronRight,
  Settings
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";

type NavItemProps = {
  href: string;
  label: string;
  icon: ReactNode;
  isActive?: boolean;
};

function NavItem({ href, label, icon, isActive }: NavItemProps) {
  return (
    <Link href={href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start mb-1",
          isActive ? "bg-secondary" : ""
        )}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
}

type SellerLayoutProps = {
  children: ReactNode;
  title: string;
};

export function SellerLayout({ children, title }: SellerLayoutProps) {
  const [location] = useLocation();
  const { user, isSeller } = useAuth();

  if (!user || !isSeller) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Truy cập bị từ chối</h1>
            <p className="mb-6">Bạn không có quyền truy cập vào trang này. Vui lòng đăng ký để trở thành người bán.</p>
            <Link href={ROUTES.SELLER.REGISTER}>
              <Button>Đăng ký bán hàng</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link href={ROUTES.HOME}>
            <Button variant="ghost" size="sm">Trang chủ</Button>
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <span className="font-medium">Kênh người bán</span>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <span className="font-medium">{title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-card rounded-lg border border-border p-4">
              <h2 className="font-semibold mb-4 px-3">Quản lý cửa hàng</h2>
              <nav className="space-y-1">
                <NavItem
                  href={ROUTES.SELLER.DASHBOARD}
                  label="Tổng quan"
                  icon={<LayoutDashboard className="h-5 w-5" />}
                  isActive={location === ROUTES.SELLER.DASHBOARD}
                />
                <NavItem
                  href={ROUTES.SELLER.PRODUCTS}
                  label="Sản phẩm"
                  icon={<Package className="h-5 w-5" />}
                  isActive={location === ROUTES.SELLER.PRODUCTS}
                />
                <NavItem
                  href={ROUTES.SELLER.ORDERS}
                  label="Đơn hàng"
                  icon={<ShoppingBag className="h-5 w-5" />}
                  isActive={location === ROUTES.SELLER.ORDERS}
                />
                <NavItem
                  href={ROUTES.SELLER.WALLET}
                  label="Ví & Doanh thu"
                  icon={<CircleDollarSign className="h-5 w-5" />}
                  isActive={location === ROUTES.SELLER.WALLET}
                />
                <NavItem
                  href={ROUTES.SELLER.PROFILE}
                  label="Hồ sơ cửa hàng"
                  icon={<User className="h-5 w-5" />}
                  isActive={location === ROUTES.SELLER.PROFILE}
                />
                <NavItem
                  href={ROUTES.SELLER.SETTINGS}
                  label="Cài đặt"
                  icon={<Settings className="h-5 w-5" />}
                  isActive={location === ROUTES.SELLER.SETTINGS}
                />
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-card rounded-lg border border-border p-6">
              <h1 className="text-2xl font-bold mb-6">{title}</h1>
              {children}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}