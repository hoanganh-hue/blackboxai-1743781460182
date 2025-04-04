import { useState } from "react";
import { Link } from "wouter";
import { Bell, Search as SearchIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "@/components/ui/search";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";

export function AdminHeader() {
  const { user } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-4 md:px-6">
      <div className="flex items-center flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        <div className="md:flex-1 md:flex md:justify-end hidden md:block">
          <Search
            compact={true}
            placeholder="Tìm kiếm..."
            className="md:w-64 lg:w-80"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full" />
        </Button>

        <Link href={ROUTES.HOME}>
          <Button variant="outline" size="sm">
            Về trang chủ
          </Button>
        </Link>

        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.profileImage} alt={user?.username} />
          <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      {/* Mobile Search */}
      {showMobileMenu && (
        <div className="absolute top-16 left-0 right-0 bg-card border-b border-border p-4 md:hidden">
          <Search placeholder="Tìm kiếm..." />
        </div>
      )}
    </header>
  );
}
