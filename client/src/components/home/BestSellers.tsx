import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import { ROUTES, API_ENDPOINTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { Rating } from "@/components/ui/rating";
import { formatCurrency } from "@/lib/utils";

// Sample top-selling products
const SAMPLE_TOP_PRODUCTS = [
  {
    id: 6,
    name: "Giày thể thao chạy bộ chống trơn trượt",
    slug: "giay-the-thao-chay-bo-chong-tron-truot",
    price: 1599000,
    discountedPrice: 1299000,
    isDiscounted: true,
    stock: 150,
    categoryId: 1,
    sellerId: 3,
    status: "approved",
    isFeatured: false,
    sold: 2589,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 7,
    name: "Áo thun nam cotton 100% mềm mại thoáng khí",
    slug: "ao-thun-nam-cotton-100-mem-mai-thoang-khi",
    price: 299000,
    discountedPrice: 199000,
    isDiscounted: true,
    stock: 500,
    categoryId: 1,
    sellerId: 2,
    status: "approved",
    isFeatured: false,
    sold: 4215,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 8,
    name: "Camera kỹ thuật số 4K chống rung quang học",
    slug: "camera-ky-thuat-so-4k-chong-rung-quang-hoc",
    price: 6299000,
    discountedPrice: 5499000,
    isDiscounted: true,
    stock: 75,
    categoryId: 2,
    sellerId: 1,
    status: "approved",
    isFeatured: false,
    sold: 1024,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Hình ảnh tương ứng với sản phẩm thực
const SAMPLE_IMAGES = [
  "https://cdn-icons-png.flaticon.com/512/2589/2589903.png", // Giày thể thao
  "https://cdn-icons-png.flaticon.com/512/17668/17668924.png", // Áo thun nam cotton
  "https://cdn-icons-png.flaticon.com/512/1042/1042339.png"  // Camera kỹ thuật số
];

// Sample ratings
const SAMPLE_RATINGS = [
  { average: 4.9, count: 128 },
  { average: 4.8, count: 352 },
  { average: 4.7, count: 89 }
];

export function BestSellers() {
  const { data: topProducts, isLoading } = useQuery<Product[]>({
    queryKey: [API_ENDPOINTS.PRODUCTS.TOP_SELLING],
    enabled: false // Disable fetching since we're using sample data for now
  });

  // Use sample products for now
  const displayProducts = topProducts || SAMPLE_TOP_PRODUCTS;

  return (
    <section className="py-8 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sản phẩm bán chạy</h2>
        <Link href={ROUTES.HOME} className="text-primary hover:text-primary/80">
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            className="bg-card rounded-lg overflow-hidden flex border border-border shadow-md hover:shadow-lg transition duration-300"
          >
            <div className="w-1/3 min-h-40 relative">
              <img
                src={SAMPLE_IMAGES[index % SAMPLE_IMAGES.length]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="w-2/3 p-4">
              <Link href={ROUTES.PRODUCT.DETAIL(product.slug)} className="block">
                <h3 className="font-medium mb-1 line-clamp-2 hover:text-primary">{product.name}</h3>
              </Link>
              <div className="flex items-center mb-1">
                <Rating
                  value={SAMPLE_RATINGS[index % SAMPLE_RATINGS.length].average}
                  size="sm"
                  showValue
                />
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  Đã bán {product.sold}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-primary font-bold">
                  {formatCurrency(product.discountedPrice || product.price)}
                </span>
                {product.isDiscounted && (
                  <span className="text-muted-foreground text-xs line-through ml-1">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium py-1 px-3 rounded transition border-none"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Thêm vào giỏ
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
