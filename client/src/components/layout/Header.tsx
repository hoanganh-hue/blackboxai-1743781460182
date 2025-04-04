import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Package,
  Settings,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TikTokShopIcon } from "@/components/ui/tiktok-logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { user, isAdmin, isSeller, logoutMutation } = useAuth();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-background border-b border-border transition-shadow ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href={ROUTES.HOME} className="flex items-center">
              <TikTokShopIcon className="h-8 w-8 text-primary" size={32} />
              <span className="ml-2 text-xl font-bold text-foreground">
                TikTok Shop
              </span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <Search />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/wishlist">
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href={ROUTES.CART}>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      0
                    </span>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.profileImage || undefined}
                          alt={user.username}
                        />
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.fullName || user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.ACCOUNT} className="w-full cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Tài khoản</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.ORDERS} className="w-full cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Đơn hàng</span>
                      </Link>
                    </DropdownMenuItem>
                    {isSeller && (
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.SELLER.DASHBOARD} className="w-full cursor-pointer">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          <span>Kênh người bán</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.ADMIN.DASHBOARD} className="w-full cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Quản trị viên</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href={ROUTES.AUTH}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link href={ROUTES.CART}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {user && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search (only visible on small screens) */}
      <div className="md:hidden p-4 bg-background border-b border-border">
        <Search />
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-2 space-y-1">
            {user ? (
              <>
                <div className="flex items-center p-3 border-b border-border">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage
                      src={user.profileImage || undefined}
                      alt={user.username}
                    />
                    <AvatarFallback>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.fullName || user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link href={ROUTES.ACCOUNT}>
                  <Button variant="ghost" className="w-full justify-start">
                    <UserIcon className="mr-2 h-5 w-5" />
                    Tài khoản
                  </Button>
                </Link>
                <Link href={ROUTES.ORDERS}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="mr-2 h-5 w-5" />
                    Đơn hàng
                  </Button>
                </Link>
                <Link href="/wishlist">
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="mr-2 h-5 w-5" />
                    Danh sách yêu thích
                  </Button>
                </Link>
                {isSeller && (
                  <Link href={ROUTES.SELLER.DASHBOARD}>
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Kênh người bán
                    </Button>
                  </Link>
                )}
                {isAdmin && (
                  <Link href={ROUTES.ADMIN.DASHBOARD}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-5 w-5" />
                      Quản trị viên
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Đăng xuất
                </Button>
              </>
            ) : (
              <Link href={ROUTES.AUTH}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
