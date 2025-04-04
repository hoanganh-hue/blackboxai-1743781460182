import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ROUTES } from "@/lib/constants";

export function Banner() {
  return (
    <div className="relative bg-background">
      <div className="container mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="TikTok Shop Banner"
            className="w-full h-64 md:h-80 object-cover rounded-lg"
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center p-8 z-20">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              TikTok Shop
            </h1>
            <p className="text-xl text-white/90 mb-6 max-w-md">
              Mua sắm dễ dàng, nhanh chóng với hàng nghìn sản phẩm chất lượng cao.
            </p>
            <Link href={ROUTES.HOME}>
              <Button className="bg-white text-primary hover:bg-gray-100 font-semibold py-2 px-6 rounded-full inline-block w-max transition">
                Khám phá ngay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
