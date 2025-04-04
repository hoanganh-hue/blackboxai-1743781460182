import { Layout } from "@/components/layout/Layout";
import { Banner } from "@/components/home/Banner";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BestSellers } from "@/components/home/BestSellers";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <Layout>
      {/* Banner Section */}
      <Banner />

      {/* Category Section */}
      <CategorySection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Best Sellers */}
      <BestSellers />

      {/* Sale Banner */}
      <section className="py-8 container mx-auto px-4">
        <div className="relative rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 opacity-90 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Flash Sale"
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center p-6 z-20">
            <p className="text-white/80 mb-2 text-lg">Đừng bỏ lỡ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              FLASH SALE CUỐI TUẦN
            </h2>
            <p className="text-white/90 mb-6 text-lg">
              Giảm đến 70% tất cả sản phẩm!
            </p>
            <Button className="bg-white text-primary hover:bg-gray-100 font-semibold">
              Mua ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-8 container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Thương hiệu nổi bật</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`brand-${index}`}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-center h-24"
            >
              <span className="text-xl font-bold text-muted-foreground">
                Brand {index + 1}
              </span>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
