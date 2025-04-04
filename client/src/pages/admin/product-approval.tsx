import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Clock,
  Eye,
  X,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Store,
  Tag,
  ArrowUpDown,
  ImageIcon,
  Package,
} from "lucide-react";

export default function AdminProductApprovalPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [sortOrder, setSortOrder] = useState<{ field: string; direction: "asc" | "desc" }>({
    field: "createdAt",
    direction: "desc",
  });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);

  // Fetch products for approval
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-products-approval", activeTab],
    queryFn: getQueryFn({ url: `/api/admin/products/approval?status=${activeTab}` }),
  });

  // Approve product mutation
  const approveProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("PATCH", `/api/admin/products/${productId}/approve`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-approval"] });
      toast({
        title: "Phê duyệt thành công",
        description: "Sản phẩm đã được phê duyệt và sẽ được hiển thị trên trang web",
      });
      setShowProductDialog(false);
      setSelectedProduct(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Phê duyệt thất bại",
        description: error.message || "Đã có lỗi xảy ra khi phê duyệt sản phẩm",
        variant: "destructive",
      });
    },
  });

  // Reject product mutation
  const rejectProductMutation = useMutation({
    mutationFn: async ({
      productId,
      reason,
    }: {
      productId: number;
      reason: string;
    }) => {
      const res = await apiRequest("PATCH", `/api/admin/products/${productId}/reject`, {
        reason,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-approval"] });
      toast({
        title: "Từ chối thành công",
        description: "Sản phẩm đã bị từ chối và người bán sẽ nhận được thông báo",
      });
      setShowRejectionDialog(false);
      setShowProductDialog(false);
      setSelectedProduct(null);
      setRejectionReason("");
    },
    onError: (error: Error) => {
      toast({
        title: "Từ chối thất bại",
        description: error.message || "Đã có lỗi xảy ra khi từ chối sản phẩm",
        variant: "destructive",
      });
    },
  });

  // Handle product approval
  const handleApproveProduct = () => {
    if (!selectedProduct) return;
    approveProductMutation.mutate(selectedProduct.id);
  };

  // Handle product rejection
  const handleRejectProduct = () => {
    if (!selectedProduct || !rejectionReason) return;
    rejectProductMutation.mutate({
      productId: selectedProduct.id,
      reason: rejectionReason,
    });
  };

  // Filter and sort products
  const filteredProducts = products
    ? products
        .filter((product: any) => {
          return (
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description &&
              product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.seller?.storeName &&
              product.seller.storeName.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        })
        .sort((a: any, b: any) => {
          const field = sortOrder.field;
          if (field === "createdAt") {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder.direction === "asc" ? dateA - dateB : dateB - dateA;
          }
          if (field === "price") {
            return sortOrder.direction === "asc"
              ? a.price - b.price
              : b.price - a.price;
          }
          if (field === "seller") {
            const sellerA = a.seller?.storeName || "";
            const sellerB = b.seller?.storeName || "";
            return sortOrder.direction === "asc"
              ? sellerA.localeCompare(sellerB)
              : sellerB.localeCompare(sellerA);
          }
          return 0;
        })
    : [];

  // Format currency to US Dollars
  const formatCurrency = (value: number) => {
    // Giả định tỷ giá chuyển đổi từ VND sang USD (ví dụ: 1 USD = 24,000 VND)
    const usdValue = value / 24000;
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdValue);
  };

  // Toggle sort order
  const toggleSortOrder = (field: string) => {
    if (sortOrder.field === field) {
      setSortOrder({
        field,
        direction: sortOrder.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortOrder({ field, direction: "asc" });
    }
  };

  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (sortOrder.field !== field) return null;
    return (
      <ArrowUpDown
        className={`ml-1 h-4 w-4 ${
          sortOrder.direction === "asc" ? "transform rotate-180" : ""
        }`}
      />
    );
  };

  return (
    <AdminLayout title="Phê duyệt sản phẩm">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div>
              <CardTitle>Danh sách sản phẩm chờ duyệt</CardTitle>
              <CardDescription>
                Xem xét và phê duyệt các sản phẩm đã được đăng bởi người bán
              </CardDescription>
            </div>
            <div className="relative flex w-full max-w-sm items-center">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Chờ phê duyệt</TabsTrigger>
              <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
              <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-20" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">
                  Đã có lỗi xảy ra khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Không có sản phẩm nào chờ duyệt</h3>
                  <p className="text-muted-foreground mt-2">
                    Tất cả sản phẩm đã được xử lý. Kiểm tra lại sau khi có sản phẩm mới được đăng.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("seller")}
                      >
                        <div className="flex items-center">
                          Người bán {getSortIndicator("seller")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("createdAt")}
                      >
                        <div className="flex items-center">
                          Ngày đăng {getSortIndicator("createdAt")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("price")}
                      >
                        <div className="flex items-center">
                          Giá {getSortIndicator("price")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                              {product.mainImage ? (
                                <img
                                  src={product.mainImage}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="flex mt-1">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {product.category?.name || "Không có danh mục"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={product.seller?.logo} />
                              <AvatarFallback>
                                <Store className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span>{product.seller?.storeName || "Không xác định"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            {product.discountedPrice ? (
                              <>
                                <span className="font-medium">
                                  {formatCurrency(product.discountedPrice)}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatCurrency(product.price)}
                                </span>
                              </>
                            ) : (
                              <span className="font-medium">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowProductDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Chi tiết
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedProduct(product);
                                handleApproveProduct();
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowRejectionDialog(true);
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            <TabsContent value="approved" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-20" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">
                  Đã có lỗi xảy ra khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Không có sản phẩm đã duyệt</h3>
                  <p className="text-muted-foreground mt-2">
                    Chưa có sản phẩm nào được phê duyệt trong hệ thống.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("seller")}
                      >
                        <div className="flex items-center">
                          Người bán {getSortIndicator("seller")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("createdAt")}
                      >
                        <div className="flex items-center">
                          Ngày duyệt {getSortIndicator("createdAt")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("price")}
                      >
                        <div className="flex items-center">
                          Giá {getSortIndicator("price")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                              {product.mainImage ? (
                                <img
                                  src={product.mainImage}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="flex mt-1">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {product.category?.name || "Không có danh mục"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={product.seller?.logo} />
                              <AvatarFallback>
                                <Store className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span>{product.seller?.storeName || "Không xác định"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(product.updatedAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            {product.discountedPrice ? (
                              <>
                                <span className="font-medium">
                                  {formatCurrency(product.discountedPrice)}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatCurrency(product.price)}
                                </span>
                              </>
                            ) : (
                              <span className="font-medium">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowProductDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Chi tiết
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            <TabsContent value="rejected" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-20" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">
                  Đã có lỗi xảy ra khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <XCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Không có sản phẩm bị từ chối</h3>
                  <p className="text-muted-foreground mt-2">
                    Chưa có sản phẩm nào bị từ chối trong hệ thống.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("seller")}
                      >
                        <div className="flex items-center">
                          Người bán {getSortIndicator("seller")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("createdAt")}
                      >
                        <div className="flex items-center">
                          Ngày từ chối {getSortIndicator("createdAt")}
                        </div>
                      </TableHead>
                      <TableHead>Lý do từ chối</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                              {product.mainImage ? (
                                <img
                                  src={product.mainImage}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="flex mt-1">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {product.category?.name || "Không có danh mục"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={product.seller?.logo} />
                              <AvatarFallback>
                                <Store className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span>{product.seller?.storeName || "Không xác định"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(product.updatedAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs line-clamp-2">
                            {product.rejectionReason || "Không có lý do được ghi nhận"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowProductDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Chi tiết
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedProduct(product);
                                handleApproveProduct();
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Duyệt lại
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Product Detail Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
            <DialogDescription>
              Xem chi tiết sản phẩm trước khi phê duyệt
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-square rounded-md overflow-hidden border">
                    {selectedProduct.mainImage ? (
                      <img
                        src={selectedProduct.mainImage}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {selectedProduct.images && selectedProduct.images.length > 0 && (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {selectedProduct.images.map((image: any, index: number) => (
                          <CarouselItem key={index} className="basis-1/3">
                            <div className="aspect-square rounded-md overflow-hidden border p-1">
                              <img
                                src={image.url}
                                alt={`${selectedProduct.name} ${index + 1}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-0" />
                      <CarouselNext className="right-0" />
                    </Carousel>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {selectedProduct.category?.name || "Không có danh mục"}
                      </Badge>
                      {selectedProduct.isFeatured && (
                        <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                          Nổi bật
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Giá</div>
                    <div className="flex items-center space-x-2">
                      {selectedProduct.discountedPrice ? (
                        <>
                          <span className="text-lg font-bold">
                            {formatCurrency(selectedProduct.discountedPrice)}
                          </span>
                          <span className="text-muted-foreground line-through">
                            {formatCurrency(selectedProduct.price)}
                          </span>
                          <Badge className="bg-green-50 text-green-800 border-green-200">
                            Giảm{" "}
                            {Math.round(
                              ((selectedProduct.price - selectedProduct.discountedPrice) /
                                selectedProduct.price) *
                                100
                            )}
                            %
                          </Badge>
                        </>
                      ) : (
                        <span className="text-lg font-bold">
                          {formatCurrency(selectedProduct.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Người bán</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar>
                        <AvatarImage src={selectedProduct.seller?.logo} />
                        <AvatarFallback>
                          <Store className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {selectedProduct.seller?.storeName || "Không xác định"}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          {selectedProduct.seller?.verified ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Đã xác minh
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600">
                              <Clock className="h-3 w-3 mr-1" />
                              Chờ xác minh
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Chi tiết sản phẩm</div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Số lượng tồn kho</div>
                        <div className="font-medium">{selectedProduct.stock}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Trạng thái</div>
                        <div>
                          <Badge
                            className={
                              selectedProduct.status === "pending"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : selectedProduct.status === "approved"
                                ? "bg-green-50 text-green-800 border-green-200"
                                : "bg-red-50 text-red-800 border-red-200"
                            }
                          >
                            {selectedProduct.status === "pending"
                              ? "Chờ duyệt"
                              : selectedProduct.status === "approved"
                              ? "Đã duyệt"
                              : "Đã từ chối"}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Ngày tạo</div>
                        <div className="font-medium">
                          {new Date(selectedProduct.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Cập nhật lần cuối</div>
                        <div className="font-medium">
                          {new Date(selectedProduct.updatedAt).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Mô tả sản phẩm</div>
                    <div className="bg-muted/20 rounded-md p-3 mt-2 max-h-32 overflow-auto text-sm">
                      {selectedProduct.description || "Không có mô tả"}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedProduct.status === "rejected" && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800">Lý do từ chối</h3>
                      <div className="text-sm text-red-700 mt-1">
                        {selectedProduct.rejectionReason || "Không có lý do được ghi nhận"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                {selectedProduct.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowProductDialog(false)}
                    >
                      Đóng
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setShowRejectionDialog(true);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Từ chối
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApproveProduct}
                      disabled={approveProductMutation.isPending}
                    >
                      {approveProductMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Đang duyệt...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Duyệt sản phẩm
                        </>
                      )}
                    </Button>
                  </>
                )}
                
                {selectedProduct.status === "rejected" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowProductDialog(false)}
                    >
                      Đóng
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApproveProduct}
                      disabled={approveProductMutation.isPending}
                    >
                      {approveProductMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Đang duyệt...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Duyệt lại sản phẩm
                        </>
                      )}
                    </Button>
                  </>
                )}
                
                {selectedProduct.status === "approved" && (
                  <Button
                    variant="outline"
                    onClick={() => setShowProductDialog(false)}
                  >
                    Đóng
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lý do từ chối sản phẩm</DialogTitle>
            <DialogDescription>
              Vui lòng cung cấp lý do chi tiết để người bán có thể hiểu và khắc phục vấn đề
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="rejection-reason" className="text-sm font-medium">
                Lý do từ chối
              </label>
              <Textarea
                id="rejection-reason"
                placeholder="Ví dụ: Sản phẩm không đủ thông tin chi tiết, hình ảnh mờ, giá không hợp lý, ..."
                className="min-h-[100px]"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              {rejectionReason.length === 0 && (
                <p className="text-sm text-red-500">Vui lòng nhập lý do từ chối</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectionDialog(false);
                setRejectionReason("");
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectProduct}
              disabled={rejectProductMutation.isPending || !rejectionReason}
            >
              {rejectProductMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Từ chối sản phẩm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}