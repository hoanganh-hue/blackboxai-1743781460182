import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package, 
  CircleDollarSign, 
  Tag,
  UserCheck,
  ChevronRight,
  Settings,
  Bot,
  Store
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { TikTokShopIcon } from "@/components/ui/tiktok-logo";

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

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
};

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Truy cập bị từ chối</h1>
            <p className="mb-6">Bạn không có quyền truy cập vào trang quản trị. Trang này chỉ dành cho quản trị viên.</p>
            <Link href={ROUTES.HOME}>
              <Button>Quay lại trang chủ</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center px-6">
          <Link href={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-2 font-semibold">
            <TikTokShopIcon className="h-6 w-6" />
            <span>TikTok Shop Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Link href={ROUTES.HOME}>
              <Button variant="ghost" size="sm">
                Về trang chủ
              </Button>
            </Link>
            <div className="h-8 w-px bg-muted"></div>
            <span className="text-sm text-muted-foreground">
              {user.username} (Admin)
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-muted/10 md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <nav className="flex-1 space-y-1 pt-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                QUẢN LÝ CHUNG
              </div>
              <NavItem
                href={ROUTES.ADMIN.DASHBOARD}
                label="Tổng quan"
                icon={<LayoutDashboard className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.DASHBOARD}
              />
              <NavItem
                href={ROUTES.ADMIN.USERS}
                label="Người dùng"
                icon={<Users className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.USERS}
              />
              <NavItem
                href={ROUTES.ADMIN.ORDERS}
                label="Đơn hàng"
                icon={<ShoppingBag className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.ORDERS}
              />
              <NavItem
                href={ROUTES.ADMIN.CATEGORIES}
                label="Danh mục"
                icon={<Tag className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.CATEGORIES}
              />
              <NavItem
                href={ROUTES.ADMIN.UPDATE_ICONS}
                label="Cập nhật biểu tượng"
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>}
                isActive={location === ROUTES.ADMIN.UPDATE_ICONS}
              />

              <div className="text-xs font-semibold text-muted-foreground mt-6 mb-2 px-2">
                QUẢN LÝ NỘI DUNG
              </div>
              <NavItem
                href={ROUTES.ADMIN.PRODUCTS}
                label="Sản phẩm"
                icon={<Package className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.PRODUCTS}
              />
              <NavItem
                href={ROUTES.ADMIN.PRODUCT_APPROVAL}
                label="Phê duyệt sản phẩm"
                icon={<UserCheck className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.PRODUCT_APPROVAL}
              />
              <NavItem
                href={ROUTES.ADMIN.SELLERS}
                label="Người bán"
                icon={<Store className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.SELLERS}
              />
              <NavItem
                href={ROUTES.ADMIN.SAMPLE_STORE}
                label="Cửa hàng mẫu"
                icon={<Store className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.SAMPLE_STORE}
              />

              <div className="text-xs font-semibold text-muted-foreground mt-6 mb-2 px-2">
                QUẢN LÝ TÀI CHÍNH
              </div>
              <NavItem
                href={ROUTES.ADMIN.WALLET}
                label="Ví hệ thống"
                icon={<CircleDollarSign className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.WALLET}
              />
              <NavItem
                href={ROUTES.ADMIN.WITHDRAWALS}
                label="Rút tiền"
                icon={<CircleDollarSign className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.WITHDRAWALS}
              />

              <div className="text-xs font-semibold text-muted-foreground mt-6 mb-2 px-2">
                HỆ THỐNG
              </div>
              <NavItem
                href={ROUTES.ADMIN.BOTS}
                label="Quản lý bot"
                icon={<Bot className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.BOTS}
              />
              <NavItem
                href={ROUTES.ADMIN.SETTINGS}
                label="Cài đặt"
                icon={<Settings className="h-5 w-5" />}
                isActive={location === ROUTES.ADMIN.SETTINGS}
              />
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center mb-6">
            <Link href={ROUTES.ADMIN.DASHBOARD}>
              <Button variant="ghost" size="sm">Trang chủ Admin</Button>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <span className="font-medium">{title}</span>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}