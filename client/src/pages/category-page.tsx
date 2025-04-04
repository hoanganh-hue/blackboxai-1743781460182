import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  ChevronRight, 
  Grid3X3, 
  List,
  ShoppingCart,
  X
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS, SAMPLE_CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

// Sample products for UI display
const sampleProducts = [
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
  },
  {
    id: 6,
    name: "Máy ảnh kỹ thuật số 20MP",
    slug: "may-anh-ky-thuat-so-20mp",
    price: 8999000,
    discountedPrice: 7499000,
    isDiscounted: true,
    stock: 30,
    categoryId: 2,
    sellerId: 3,
    status: "approved",
    isFeatured: false,
    sold: 98,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 7,
    name: "Loa Bluetooth chống nước",
    slug: "loa-bluetooth-chong-nuoc",
    price: 1299000,
    discountedPrice: null,
    isDiscounted: false,
    stock: 150,
    categoryId: 2,
    sellerId: 2,
    status: "approved",
    isFeatured: false,
    sold: 345,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 8,
    name: "Bàn phím cơ gaming RGB",
    slug: "ban-phim-co-gaming-rgb",
    price: 2399000,
    discountedPrice: 1899000,
    isDiscounted: true,
    stock: 80,
    categoryId: 2,
    sellerId: 1,
    status: "approved",
    isFeatured: false,
    sold: 267,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Hình ảnh thực tế phù hợp với từng sản phẩm
const sampleImages = [
  "https://cdn-icons-png.flaticon.com/512/3174/3174838.png", // Đồng hồ thông minh
  "https://cdn-icons-png.flaticon.com/512/1029/1029714.png", // Tai nghe không dây
  "https://cdn-icons-png.flaticon.com/512/2553/2553691.png", // Bộ sản phẩm dưỡng da
  "https://cdn-icons-png.flaticon.com/512/4365/4365868.png", // Điện thoại thông minh
  "https://cdn-icons-png.flaticon.com/512/2991/2991586.png", // Túi xách nữ
  "https://cdn-icons-png.flaticon.com/512/1042/1042339.png", // Máy ảnh kỹ thuật số
  "https://cdn-icons-png.flaticon.com/512/7899/7899594.png", // Loa Bluetooth
  "https://cdn-icons-png.flaticon.com/512/2351/2351891.png"  // Bàn phím cơ
];

// Sample ratings
const sampleRatings = [
  { average: 5.0, count: 120 },
  { average: 4.8, count: 89 },
  { average: 4.9, count: 56 },
  { average: 4.7, count: 234 },
  { average: 4.8, count: 78 },
  { average: 4.6, count: 45 },
  { average: 4.9, count: 67 },
  { average: 4.7, count: 112 }
];

// Sort options
const sortOptions = [
  { value: "relevance", label: "Sắp xếp theo: Liên quan" },
  { value: "newest", label: "Sắp xếp theo: Mới nhất" },
  { value: "price_asc", label: "Sắp xếp theo: Giá tăng dần" },
  { value: "price_desc", label: "Sắp xếp theo: Giá giảm dần" },
  { value: "best_selling", label: "Sắp xếp theo: Bán chạy nhất" },
];

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Fetch category
  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: [API_ENDPOINTS.CATEGORIES.BY_SLUG(slug || '')],
    // Disabled for now since we're using sample data
    enabled: false
  });

  // Fetch products by category
  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: [API_ENDPOINTS.PRODUCTS.BY_CATEGORY(1), { sortBy, priceRange }],
    enabled: false
    // Disabled for now, normally would need the category ID
  });

  // Find current category from samples
  const currentCategory = SAMPLE_CATEGORIES.find(cat => cat.slug === slug) || {
    id: 2,
    name: "Điện tử",
    slug: "dien-tu",
    icon: "Smartphone"
  };

  // Use sample products
  const displayProducts = products || sampleProducts;

  // Filter and sort products
  const sortedProducts = [...displayProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return (a.discountedPrice || a.price) - (b.discountedPrice || b.price);
      case "price_desc":
        return (b.discountedPrice || b.price) - (a.discountedPrice || a.price);
      case "best_selling":
        return b.sold - a.sold;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Format price for display
  const formatPriceRange = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}tr`;
    }
    return `${(value / 1000).toFixed(0)}k`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <a href="/" className="text-muted-foreground hover:text-foreground">
            Trang chủ
          </a>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground font-medium">
            {currentCategory.name}
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-6">{currentCategory.name}</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters - Desktop */}
          <div className="hidden lg:block w-64 space-y-6">
            <div className="bg-card rounded-lg p-4">
              <h3 className="font-medium mb-4">Lọc theo giá</h3>
              <div className="space-y-6">
                <Slider
                  value={[priceRange[0], priceRange[1]]}
                  min={0}
                  max={20000000}
                  step={100000}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  className="my-6"
                />
                <div className="flex items-center justify-between">
                  <Input 
                    value={formatCurrency(priceRange[0])} 
                    readOnly 
                    className="w-[45%] text-center"
                  />
                  <span className="text-muted-foreground">đến</span>
                  <Input 
                    value={formatCurrency(priceRange[1])} 
                    readOnly 
                    className="w-[45%] text-center" 
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                >
                  Áp dụng
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4">
              <h3 className="font-medium mb-4">Đánh giá</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <Checkbox id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="ml-1">trở lên</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg p-4">
              <h3 className="font-medium mb-4">Nhãn hiệu</h3>
              <div className="space-y-2">
                {['Samsung', 'Apple', 'Xiaomi', 'Sony', 'LG'].map((brand) => (
                  <div key={brand} className="flex items-center">
                    <Checkbox id={`brand-${brand}`} />
                    <Label htmlFor={`brand-${brand}`} className="ml-2">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6 bg-card p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Lọc
                </Button>
                
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-[180px] sm:w-[250px]">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-4">
                  {displayProducts.length} sản phẩm
                </span>
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Product grid */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    imageUrl={sampleImages[index % sampleImages.length]}
                    ratings={sampleRatings[index % sampleRatings.length]}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow flex"
                  >
                    <div className="w-40 h-40 overflow-hidden flex-shrink-0">
                      <img
                        src={sampleImages[index % sampleImages.length]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-medium hover:text-primary line-clamp-2">
                          <a href={`/product/${product.slug}`}>{product.name}</a>
                        </h3>
                        <div className="flex items-center mt-1 mb-2">
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(sampleRatings[index % sampleRatings.length].average)
                                    ? "fill-current"
                                    : "text-gray-400"
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({sampleRatings[index % sampleRatings.length].count})
                          </span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            Đã bán {product.sold}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-primary font-bold">
                            {formatCurrency(product.discountedPrice || product.price)}
                          </span>
                          {product.isDiscounted && (
                            <span className="text-muted-foreground text-xs line-through ml-2">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                        <Button>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Thêm vào giỏ
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile filters drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50" 
              onClick={() => setMobileFiltersOpen(false)} 
            />
            
            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Lọc sản phẩm</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Lọc theo giá</h3>
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    min={0}
                    max={20000000}
                    step={100000}
                    onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    className="my-6"
                  />
                  <div className="flex items-center justify-between">
                    <Input 
                      value={formatCurrency(priceRange[0])} 
                      readOnly 
                      className="w-[45%] text-center"
                    />
                    <span className="text-muted-foreground">đến</span>
                    <Input 
                      value={formatCurrency(priceRange[1])} 
                      readOnly 
                      className="w-[45%] text-center" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Đánh giá</h3>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <Checkbox id={`mobile-rating-${rating}`} />
                      <Label htmlFor={`mobile-rating-${rating}`} className="ml-2 flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                        <span className="ml-1">trở lên</span>
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Nhãn hiệu</h3>
                  {['Samsung', 'Apple', 'Xiaomi', 'Sony', 'LG'].map((brand) => (
                    <div key={brand} className="flex items-center">
                      <Checkbox id={`mobile-brand-${brand}`} />
                      <Label htmlFor={`mobile-brand-${brand}`} className="ml-2">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="w-1/2"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button 
                    className="w-1/2"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
