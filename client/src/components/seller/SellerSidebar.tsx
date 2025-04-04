import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  CreditCard,
  User,
  ChevronRight,
  Store,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import TiktokShopLogo from "@/assets/tiktok-shop-logo.svg";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, href, active, onClick }: SidebarItemProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center p-3 rounded-md text-sm font-medium transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
        onClick={onClick}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </a>
    </Link>
  );
}

export function SellerSidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div
      className={cn(
        "h-screen flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        <Link href={ROUTES.HOME}>
          <a className="flex items-center">
            <TiktokShopLogo className="h-8 w-8 text-primary" />
            {!collapsed && (
              <span className="ml-2 text-xl font-bold">TikTok Shop</span>
            )}
          </a>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "transform rotate-180"
            )}
          />
        </Button>
      </div>

      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {collapsed ? (
          // Collapsed view
          <>
            <Link href={ROUTES.SELLER.DASHBOARD}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.SELLER.DASHBOARD)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
              </a>
            </Link>
            <Link href={ROUTES.SELLER.PRODUCTS}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.SELLER.PRODUCTS)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <ShoppingBag className="h-5 w-5" />
              </a>
            </Link>
            <Link href={ROUTES.SELLER.ORDERS}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.SELLER.ORDERS)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Package className="h-5 w-5" />
              </a>
            </Link>
            <Link href={ROUTES.SELLER.WALLET}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.SELLER.WALLET)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <CreditCard className="h-5 w-5" />
              </a>
            </Link>
            <Link href={ROUTES.SELLER.PROFILE}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.SELLER.PROFILE)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Store className="h-5 w-5" />
              </a>
            </Link>
          </>
        ) : (
          // Expanded view
          <>
            <SidebarItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Bảng điều khiển"
              href={ROUTES.SELLER.DASHBOARD}
              active={isActive(ROUTES.SELLER.DASHBOARD)}
            />
            <SidebarItem
              icon={<ShoppingBag className="h-5 w-5" />}
              label="Sản phẩm"
              href={ROUTES.SELLER.PRODUCTS}
              active={isActive(ROUTES.SELLER.PRODUCTS)}
            />
            <SidebarItem
              icon={<Package className="h-5 w-5" />}
              label="Đơn hàng"
              href={ROUTES.SELLER.ORDERS}
              active={isActive(ROUTES.SELLER.ORDERS)}
            />
            <SidebarItem
              icon={<BarChart2 className="h-5 w-5" />}
              label="Thống kê"
              href="/seller/statistics"
              active={isActive("/seller/statistics")}
            />
            <SidebarItem
              icon={<CreditCard className="h-5 w-5" />}
              label="Ví tiền"
              href={ROUTES.SELLER.WALLET}
              active={isActive(ROUTES.SELLER.WALLET)}
            />
            <SidebarItem
              icon={<Store className="h-5 w-5" />}
              label="Hồ sơ cửa hàng"
              href={ROUTES.SELLER.PROFILE}
              active={isActive(ROUTES.SELLER.PROFILE)}
            />
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              label="Cài đặt"
              href="/seller/settings"
              active={isActive("/seller/settings")}
            />
          </>
        )}
      </div>

      <div className="p-3 border-t border-border">
        <Button
          variant="destructive"
          className={cn(
            "w-full justify-center",
            collapsed ? "px-0" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Đăng xuất</span>}
        </Button>
      </div>
    </div>
  );
}
