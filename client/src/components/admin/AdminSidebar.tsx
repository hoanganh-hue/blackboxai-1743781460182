import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  Store,
  ShieldCheck,
  Bot,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import TiktokShopLogo from "@/assets/tiktok-shop-logo.svg";
import { useAuth } from "@/hooks/use-auth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

interface SidebarGroupProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SidebarGroup({ label, icon, children, defaultOpen = false }: SidebarGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          <div className="flex items-center">
            {icon}
            <span className="ml-3">{label}</span>
          </div>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "transform rotate-180")}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-10 space-y-1 mt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AdminSidebar() {
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
            <Link href={ROUTES.ADMIN.DASHBOARD}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.ADMIN.DASHBOARD)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
              </a>
            </Link>
            <Link href={ROUTES.ADMIN.PRODUCTS}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.ADMIN.PRODUCTS)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <ShoppingCart className="h-5 w-5" />
              </a>
            </Link>
            <Link href={ROUTES.ADMIN.USERS}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.ADMIN.USERS)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Users className="h-5 w-5" />
              </a>
            </Link>
            <Link href={ROUTES.ADMIN.SELLERS}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.ADMIN.SELLERS)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Store className="h-5 w-5" />
              </a>
            </Link>
            <Link href={ROUTES.ADMIN.ORDERS}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.ADMIN.ORDERS)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Package className="h-5 w-5" />
              </a>
            </Link>
            <Link href={ROUTES.ADMIN.SAMPLE_STORE}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.ADMIN.SAMPLE_STORE)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <ShieldCheck className="h-5 w-5" />
              </a>
            </Link>
            <Link href={ROUTES.ADMIN.BOTS}>
              <a
                className={cn(
                  "flex justify-center items-center p-3 rounded-md transition-colors",
                  isActive(ROUTES.ADMIN.BOTS)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Bot className="h-5 w-5" />
              </a>
            </Link>
          </>
        ) : (
          // Expanded view
          <>
            <SidebarItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Bảng điều khiển"
              href={ROUTES.ADMIN.DASHBOARD}
              active={isActive(ROUTES.ADMIN.DASHBOARD)}
            />

            <SidebarGroup
              label="Sản phẩm"
              icon={<ShoppingCart className="h-5 w-5" />}
              defaultOpen={location.startsWith("/admin/product")}
            >
              <SidebarItem
                icon={<ChevronRight className="h-4 w-4" />}
                label="Quản lý sản phẩm"
                href={ROUTES.ADMIN.PRODUCTS}
                active={isActive(ROUTES.ADMIN.PRODUCTS)}
              />
              <SidebarItem
                icon={<ChevronRight className="h-4 w-4" />}
                label="Phê duyệt sản phẩm"
                href={ROUTES.ADMIN.PRODUCT_APPROVAL}
                active={isActive(ROUTES.ADMIN.PRODUCT_APPROVAL)}
              />
            </SidebarGroup>

            <SidebarItem
              icon={<Users className="h-5 w-5" />}
              label="Người dùng"
              href={ROUTES.ADMIN.USERS}
              active={isActive(ROUTES.ADMIN.USERS)}
            />

            <SidebarItem
              icon={<Store className="h-5 w-5" />}
              label="Người bán"
              href={ROUTES.ADMIN.SELLERS}
              active={isActive(ROUTES.ADMIN.SELLERS)}
            />

            <SidebarItem
              icon={<Package className="h-5 w-5" />}
              label="Đơn hàng"
              href={ROUTES.ADMIN.ORDERS}
              active={isActive(ROUTES.ADMIN.ORDERS)}
            />

            <SidebarGroup
              label="Tài chính"
              icon={<CreditCard className="h-5 w-5" />}
              defaultOpen={location.startsWith("/admin/wallet") || location.startsWith("/admin/withdrawals")}
            >
              <SidebarItem
                icon={<ChevronRight className="h-4 w-4" />}
                label="Quản lý ví"
                href={ROUTES.ADMIN.WALLET}
                active={isActive(ROUTES.ADMIN.WALLET)}
              />
              <SidebarItem
                icon={<ChevronRight className="h-4 w-4" />}
                label="Yêu cầu rút tiền"
                href={ROUTES.ADMIN.WITHDRAWALS}
                active={isActive(ROUTES.ADMIN.WITHDRAWALS)}
              />
            </SidebarGroup>

            <SidebarItem
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Cửa hàng mẫu"
              href={ROUTES.ADMIN.SAMPLE_STORE}
              active={isActive(ROUTES.ADMIN.SAMPLE_STORE)}
            />

            <SidebarItem
              icon={<Bot className="h-5 w-5" />}
              label="Quản lý Bot"
              href={ROUTES.ADMIN.BOTS}
              active={isActive(ROUTES.ADMIN.BOTS)}
            />

            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              label="Cấu hình"
              href="/admin/settings"
              active={isActive("/admin/settings")}
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
