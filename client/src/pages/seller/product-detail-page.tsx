import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Minus, Plus, Heart, ShoppingCart, ArrowLeft, Check, Star, Share2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import { API_ENDPOINTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDiscount } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

// Sample product data for UI display
const sampleProduct = {
  id: 1,
  name: "Đồng hồ thông minh cao cấp chống nước IP68",
  slug: "dong-ho-thong-minh-chong-nuoc",
  description: `
    <p>Đồng hồ thông minh cao cấp với màn hình AMOLED 1.5 inch, độ phân giải cao, màu sắc sống động. Thiết kế sang trọng, tinh tế phù hợp với mọi phong cách.</p>
    <p>Tính năng chính:</p>
    <ul>
      <li>Chống nước IP68, có thể sử dụng khi bơi</li>
      <li>Theo dõi sức khỏe: nhịp tim, SpO2, giấc ngủ, stress</li>
      <li>Hỗ trợ 20+ chế độ thể thao</li>
      <li>Pin dùng được 14 ngày với một lần sạc</li>
      <li>Nhận thông báo từ điện thoại</li>
      <li>Kết nối Bluetooth 5.0 ổn định</li>
    </ul>
  `,
  price: 1999000,
  discountedPrice: 1499000,
  isDiscounted: true,
  stock: 100,
  categoryId: 2,
  sellerId: 1,
  status: "approved",
  isFeatured: true,
  sold: 865
};

// Sample related products
const sampleRelatedProducts = [
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
    name: "Vòng đeo tay thông minh theo dõi sức khỏe",
    slug: "vong-deo-tay-thong-minh",
    price: 899000,
    discountedPrice: 749000,
    isDiscounted: true,
    stock: 120,
    categoryId: 2,
    sellerId: 3,
    status: "approved",
    isFeatured: true,
    sold: 325,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: "Đồng hồ thông minh trẻ em định vị GPS",
    slug: "dong-ho-thong-minh-tre-em",
    price: 1299000,
    discountedPrice: 999000,
    isDiscounted: true,
    stock: 50,
    categoryId: 2,
    sellerId: 2,
    status: "approved",
    isFeatured: true,
    sold: 453,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample product images
const sampleImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=757&q=80"
];

// Sample reviews
const sampleReviews = [
  {
    id: 1,
    userId: 101,
    username: "NguyenVanA",
    productId: 1,
    rating: 5,
    comment: "Sản phẩm tuyệt vời, đóng gói cẩn thận, giao hàng nhanh. Pin dùng được rất lâu như mô tả.",
    date: "2023-09-12"
  },
  {
    id: 2,
    userId: 102,
    username: "TranThiB",
    productId: 1,
    rating: 4,
    comment: "Chất lượng tốt, đáng giá tiền. Trừ 1 sao vì màu sắc không đúng như hình.",
    date: "2023-08-30"
  },
  {
    id: 3,
    userId: 103,
    username: "LeVanC",
    productId: 1,
    rating: 5,
    comment: "Đồng hồ rất đẹp, chống nước tốt, đo nhịp tim chính xác. Rất hài lòng với sản phẩm.",
    date: "2023-08-15"
  }
];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { isCustomer } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product details
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: [API_ENDPOINTS.PRODUCTS.BY_SLUG(slug || '')],
    // Only enable if we have a slug
    enabled: !!slug && false // false for demo purposes with sample data
  });

  // Use sample product data
  const displayProduct = product || sampleProduct;
  const displayImages = sampleImages;
  const displayReviews = sampleReviews;
  const displayRelatedProducts = sampleRelatedProducts;

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", API_ENDPOINTS.CART.ADD_ITEM, {
        productId: displayProduct.id,
        quantity: quantity
      });
    },
    onSuccess: () => {
      toast({
        title: "Đã thêm vào giỏ hàng",
        description: `${quantity} ${displayProduct.name} đã được thêm vào giỏ hàng.`,
      });
      // Invalidate cart query to refresh cart count
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CART.BASE] });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    },
  });

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      // Mock implementation
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast({
        title: "Đã thêm vào danh sách yêu thích",
        description: `${displayProduct.name} đã được thêm vào danh sách yêu thích.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm vào danh sách yêu thích.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (!isCustomer) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
        variant: "destructive",
      });
      return;
    }
    addToCartMutation.mutate();
  };

  const handleAddToWishlist = () => {
    if (!isCustomer) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích.",
        variant: "destructive",
      });
      return;
    }
    addToWishlistMutation.mutate();
  };

  const incrementQuantity = () => {
    if (quantity < displayProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Calculate average rating
  const averageRating = displayReviews.reduce((sum, review) => sum + review.rating, 0) / displayReviews.length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <a href="/" className="text-muted-foreground hover:text-foreground">
            Trang chủ
          </a>
          <span className="mx-2 text-muted-foreground">/</span>
          <a href="/category/electronic" className="text-muted-foreground hover:text-foreground">
            Điện tử
          </a>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground font-medium">
            {displayProduct.name}
          </span>
        </div>

        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4 inline-flex items-center text-sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
              <img
                src={displayImages[selectedImageIndex]}
                alt={displayProduct.name}
                className="w-full h-full object-cover"
              />
              {displayProduct.isDiscounted && (
                <Badge className="absolute top-4 left-4 bg-primary">
                  {formatDiscount(displayProduct.price, displayProduct.discountedPrice)}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {displayImages.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square border rounded-md overflow-hidden cursor-pointer ${
                    selectedImageIndex === index ? "border-primary" : "border-border"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${displayProduct.name} - Hình ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">{displayProduct.name}</h1>
            
            <div className="flex items-center space-x-4">
              <Rating value={averageRating} showValue size="md" />
              <span className="text-sm text-muted-foreground">
                ({displayReviews.length} đánh giá)
              </span>
              <span className="text-sm text-muted-foreground">
                Đã bán {displayProduct.sold}
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(displayProduct.discountedPrice || displayProduct.price)}
              </span>
              {displayProduct.isDiscounted && (
                <span className="ml-2 text-lg text-muted-foreground line-through">
                  {formatCurrency(displayProduct.price)}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="w-32 text-muted-foreground">Tình trạng</span>
                <span className="font-medium flex items-center">
                  {displayProduct.stock > 0 ? (
                    <>
                      <span className="text-green-500 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Còn hàng
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        ({displayProduct.stock} sản phẩm)
                      </span>
                    </>
                  ) : (
                    <span className="text-destructive">Hết hàng</span>
                  )}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-32 text-muted-foreground">Danh mục</span>
                <a href="#" className="text-primary hover:underline">
                  Điện tử
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center mb-6">
                <span className="mr-4 text-muted-foreground">Số lượng</span>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={incrementQuantity}
                    disabled={quantity >= displayProduct.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToWishlist}
                  disabled={addToWishlistMutation.isPending}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Yêu thích
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="mb-4">
            <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá ({displayReviews.length})</TabsTrigger>
            <TabsTrigger value="specs">Thông số kỹ thuật</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-4">
            <div
              className="prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: displayProduct.description }}
            />
          </TabsContent>
          <TabsContent value="reviews" className="py-4">
            <div className="space-y-6">
              {displayReviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {review.username.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{review.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
              <Button variant="outline" className="mt-4">
                Xem thêm đánh giá
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="specs" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold">Thông số cơ bản</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-48 text-muted-foreground">Kích thước màn hình</span>
                    <span>1.5 inch</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 text-muted-foreground">Loại màn hình</span>
                    <span>AMOLED</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 text-muted-foreground">Kết nối</span>
                    <span>Bluetooth 5.0</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 text-muted-foreground">Chống nước</span>
                    <span>IP68</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 text-muted-foreground">Dung lượng pin</span>
                    <span>400 mAh</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold">Tính năng khác</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-48 text-muted-foreground">Theo dõi sức khỏe</span>
                    <span>Nhịp tim, SpO2, Giấc ngủ</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 text-muted-foreground">Chế độ thể thao</span>
                    <span>Hỗ trợ 20+ chế độ</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 text-muted-foreground">Thời lượng pin</span>
                    <span>14 ngày (sử dụng thông thường)</span>
                  </div>
                  <div className="flex">
                    <span className="w-48 text-muted-foreground">Cảm biến</span>
                    <span>G-sensor, Cảm biến ánh sáng</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayRelatedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                imageUrl={sampleImages[index % sampleImages.length]}
                ratings={{ average: 4.5 + Math.random() * 0.5, count: 30 + Math.floor(Math.random() * 20) }}
              />
            ))}
          </div>
        </div>
        
        {/* You Might Also Like */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Có thể bạn cũng thích</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayRelatedProducts.slice().reverse().map((product, index) => (
              <ProductCard
                key={`recommend-${product.id}`}
                product={{
                  ...product,
                  id: product.id + 100, // Ensure unique keys
                  name: product.name.replace("thông minh", "cao cấp").replace("nghe", "nghe bluetooth")
                }}
                imageUrl={sampleImages[(index + 2) % sampleImages.length]}
                ratings={{ average: 4.7, count: 38 }}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
