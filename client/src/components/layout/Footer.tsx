import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { TikTokShopIcon } from "@/components/ui/tiktok-logo";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href={ROUTES.HOME} className="flex items-center mb-4">
              <TikTokShopIcon className="h-8 w-8 text-primary" size={32} />
              <span className="ml-2 text-xl font-bold text-foreground">
                TikTok Shop
              </span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Nền tảng thương mại điện tử uy tín hàng đầu Việt Nam.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Phương thức thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Vận chuyển & Giao hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Chính sách đổi trả
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Về TikTok Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Điều khoản
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Thanh toán</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`payment-${index}`} className="bg-background border border-border rounded p-2">
                  <div className="h-6 bg-muted rounded"></div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-4">Đơn vị vận chuyển</h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`shipping-${index}`} className="bg-background border border-border rounded p-2">
                  <div className="h-6 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} TikTok Shop. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
