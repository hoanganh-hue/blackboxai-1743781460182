import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

// Sample cart data for UI display
const sampleCartItems = [
  {
    id: 1,
    productId: 1,
    name: "Đồng hồ thông minh cao cấp",
    slug: "dong-ho-thong-minh-cao-cap",
    price: 1999000,
    discountedPrice: 1499000,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80",
    seller: "TechStore",
    isDiscounted: true
  },
  {
    id: 2,
    productId: 2,
    name: "Tai nghe không dây cách âm cao cấp",
    slug: "tai-nghe-khong-day-cach-am-cao-cap",
    price: 2899000,
    discountedPrice: 2499000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=684&q=80",
    seller: "AudioPro",
    isDiscounted: true
  }
];

// Sample recommended products
const sampleRecommendedProducts = [
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
    name: "Loa bluetooth không dây chống nước",
    slug: "loa-bluetooth-khong-day",
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
  },
  {
    id: 5,
    name: "Máy chụp ảnh lấy liền mini",
    slug: "may-chup-anh-lay-lien",
    price: 1699000,
    discountedPrice: null,
    isDiscounted: false,
    stock: 30,
    categoryId: 2,
    sellerId: 1,
    status: "approved",
    isFeatured: true,
    sold: 128,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    name: "Ổ cắm thông minh WiFi",
    slug: "o-cam-thong-minh",
    price: 499000,
    discountedPrice: 399000,
    isDiscounted: true,
    stock: 200,
    categoryId: 2,
    sellerId: 4,
    status: "approved",
    isFeatured: false,
    sold: 89,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample product images
const sampleImages = [
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=684&q=80",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=757&q=80"
];

export default function CartPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isCustomer } = useAuth();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Fetch cart items
  const { data: cartItems, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.CART.BASE],
    // Disabled for now since we're using sample data
    enabled: false
  });

  // Use sample cart items for UI display
  const displayCartItems = cartItems || sampleCartItems;
  
  // Fetch recommended products
  const { data: recommendedProducts } = useQuery({
    queryKey: [API_ENDPOINTS.PRODUCTS.FEATURED.DISCOUNTED],
    enabled: false
  });
  
  // Use sample recommended products
  const displayRecommendedProducts = recommendedProducts || sampleRecommendedProducts;

  // Select/deselect all items
  const toggleSelectAll = () => {
    if (selectedItems.length === displayCartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(displayCartItems.map(item => item.id));
    }
  };

  // Toggle item selection
  const toggleSelect = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Update cart item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number, quantity: number }) => {
      setIsUpdating(itemId);
      await apiRequest("PATCH", API_ENDPOINTS.CART.REMOVE_ITEM(itemId), { quantity });
      return { itemId, quantity };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CART.BASE] });
      setIsUpdating(null);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi cập nhật",
        description: error.message || "Không thể cập nhật số lượng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      setIsUpdating(null);
    },
  });

  // Remove cart item
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await apiRequest("DELETE", API_ENDPOINTS.CART.REMOVE_ITEM(itemId));
    },
    onSuccess: (_, itemId) => {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
      toast({
        title: "Đã xóa sản phẩm",
        description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
      });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CART.BASE] });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa sản phẩm. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    },
  });

  // Update quantity
  const updateQuantity = (item: any, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;
    
    updateQuantityMutation.mutate({ itemId: item.id, quantity: newQuantity });
  };

  // Remove item
  const removeItem = (itemId: number) => {
    removeItemMutation.mutate(itemId);
  };

  // Calculate subtotal for selected items
  const calculateSubtotal = () => {
    return displayCartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => {
        const price = item.discountedPrice || item.price;
        return total + price * item.quantity;
      }, 0);
  };

  // Calculate total items
  const totalItems = displayCartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total selected items
  const totalSelectedItems = displayCartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.quantity, 0);

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Chưa chọn sản phẩm",
        description: "Vui lòng chọn ít nhất một sản phẩm để tiếp tục.",
        variant: "destructive",
      });
      return;
    }
    
    // Save selected items to session/local storage or state management
    // Then navigate to checkout page
    navigate(ROUTES.CHECKOUT);
  };

  // Empty cart view
  if (displayCartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-6">
            <ShoppingBag className="h-24 w-24 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Giỏ hàng trống</h1>
            <p className="text-muted-foreground text-center max-w-md">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy tiếp tục mua sắm để tìm kiếm sản phẩm ưng ý!
            </p>
            <Link href={ROUTES.HOME}>
              <Button className="mt-4">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-4">
            {/* Header */}
            <div className="bg-card rounded-lg p-4 flex items-center">
              <div className="flex items-center">
                <Checkbox 
                  checked={selectedItems.length === displayCartItems.length && displayCartItems.length > 0} 
                  onCheckedChange={toggleSelectAll} 
                  id="select-all"
                />
                <label htmlFor="select-all" className="ml-2 cursor-pointer text-sm font-medium">
                  Chọn tất cả ({totalItems} sản phẩm)
                </label>
              </div>
            </div>
            
            {/* Cart items */}
            <div className="bg-card rounded-lg p-4 divide-y divide-border">
              {displayCartItems.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <Checkbox 
                      checked={selectedItems.includes(item.id)} 
                      onCheckedChange={() => toggleSelect(item.id)}
                    />
                    <div className="flex-shrink-0">
                      <Link href={ROUTES.PRODUCT.DETAIL(item.slug)}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-md border border-border"
                        />
                      </Link>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={ROUTES.PRODUCT.DETAIL(item.slug)}>
                        <h3 className="font-medium line-clamp-2 hover:text-primary">{item.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">Người bán: {item.seller}</p>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div>
                          <span className="font-bold text-primary">
                            {formatCurrency(item.discountedPrice || item.price)}
                          </span>
                          {item.isDiscounted && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              {formatCurrency(item.price)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            disabled={isUpdating === item.id || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            disabled={isUpdating === item.id}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                            disabled={removeItemMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {isUpdating === item.id && (
                            <Loader2 className="h-4 w-4 ml-2 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-card rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tổng số sản phẩm đã chọn:
                  </span>
                  <span>{totalSelectedItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{formatCurrency(calculateSubtotal())}</span>
                </div>
              </div>
              
              <Button
                className="w-full mt-6"
                onClick={proceedToCheckout}
                disabled={selectedItems.length === 0}
              >
                Tiến hành thanh toán
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="mt-4">
                <Link href={ROUTES.HOME} className="text-sm text-primary flex items-center justify-center hover:underline">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">Có thể bạn cũng thích</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayRecommendedProducts.map((product, index) => (
              <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                <div 
                  className="cursor-pointer" 
                  onClick={() => window.location.href = ROUTES.PRODUCT.DETAIL(product.slug)}
                >
                  <div className="relative pb-[100%] overflow-hidden bg-gray-900">
                    <img
                      src={sampleImages[index % sampleImages.length]}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {product.isDiscounted && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                        {formatDiscount(product.price, product.discountedPrice || 0)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-1">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < 4.5 ? "fill-yellow-400" : ""}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">({25 + Math.floor(Math.random() * 50)})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-primary font-bold">
                          {formatCurrency(product.discountedPrice || product.price)}
                        </span>
                        {product.isDiscounted && (
                          <span className="text-muted-foreground text-xs line-through ml-1">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Đã bán {product.sold}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
