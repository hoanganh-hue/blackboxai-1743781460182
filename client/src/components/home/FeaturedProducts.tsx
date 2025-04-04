import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ROUTES, API_ENDPOINTS } from "@/lib/constants";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/product/ProductCard";

// Sample product data
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Đồng hồ thông minh cao cấp",
    slug: "dong-ho-thong-minh-cao-cap",
    price: 1999000,
    discountedPrice: 1499000,
    isDiscounted: true,
    stock: 100,
    categoryId: 2,
    sellerId: 1,
    status: "approved",
    isFeatured: true,
    sold: 865,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: "Tai nghe không dây cách âm cao cấp",
    slug: "tai-nghe-khong-day-cach-am-cao-cap",
    price: 2899000,
    discountedPrice: 2499000,
    isDiscounted: true,
    stock: 75,
    categoryId: 2,
    sellerId: 2,
    status: "approved",
    isFeatured: true,
    sold: 532,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: "Bộ sản phẩm dưỡng da cao cấp từ thiên nhiên",
    slug: "bo-san-pham-duong-da-cao-cap-tu-thien-nhien",
    price: 899000,
    discountedPrice: null,
    isDiscounted: false,
    stock: 120,
    categoryId: 5,
    sellerId: 3,
    status: "approved",
    isFeatured: true,
    sold: 325,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: "Điện thoại thông minh màn hình AMOLED 120Hz",
    slug: "dien-thoai-thong-minh-man-hinh-amoled-120hz",
    price: 13299000,
    discountedPrice: 11999000,
    isDiscounted: true,
    stock: 50,
    categoryId: 2,
    sellerId: 2,
    status: "approved",
    isFeatured: true,
    sold: 1253,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    name: "Túi xách nữ cao cấp phong cách Hàn Quốc",
    slug: "tui-xach-nu-cao-cap-phong-cach-han-quoc",
    price: 999000,
    discountedPrice: 649000,
    isDiscounted: true,
    stock: 200,
    categoryId: 4,
    sellerId: 1,
    status: "approved",
    isFeatured: true,
    sold: 489,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sản phẩm thực tế với hình ảnh tương ứng
const SAMPLE_IMAGES = [
  "https://cdn-icons-png.flaticon.com/512/3174/3174838.png", // Đồng hồ thông minh
  "https://cdn-icons-png.flaticon.com/512/1029/1029714.png", // Tai nghe không dây
  "https://cdn-icons-png.flaticon.com/512/2553/2553691.png", // Bộ sản phẩm dưỡng da
  "https://cdn-icons-png.flaticon.com/512/4365/4365868.png", // Điện thoại thông minh
  "https://cdn-icons-png.flaticon.com/512/2991/2991586.png"  // Túi xách nữ
];

// Sample ratings
const SAMPLE_RATINGS = [
  { average: 5.0, count: 120 },
  { average: 4.8, count: 89 },
  { average: 4.9, count: 56 },
  { average: 4.7, count: 234 },
  { average: 4.8, count: 78 }
];

export function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [API_ENDPOINTS.PRODUCTS.FEATURED],
    enabled: false // Disable fetching for now since we're using sample data
  });

  // Use sample products for now
  const displayProducts = products || SAMPLE_PRODUCTS;

  return (
    <section className="py-8 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
        <Link href={ROUTES.HOME} className="text-primary hover:text-primary/80">
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            imageUrl={SAMPLE_IMAGES[index % SAMPLE_IMAGES.length]}
            ratings={SAMPLE_RATINGS[index % SAMPLE_RATINGS.length]}
          />
        ))}
      </div>
    </section>
  );
}
