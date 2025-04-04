import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Store,
  PackagePlus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Image as ImageIcon,
  Loader2,
  Eye,
  Check,
  ShoppingBag,
  Tags,
} from "lucide-react";

// Form validation schema for sample store product
const sampleProductSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  description: z.string().min(10, "Mô tả sản phẩm phải có ít nhất 10 ký tự"),
  price: z.coerce.number().min(1000, "Giá sản phẩm phải lớn hơn 1.000 VND"),
  discountedPrice: z.coerce
    .number()
    .min(0, "Giá khuyến mãi không được nhỏ hơn 0")
    .optional()
    .nullable(),
  categoryId: z.coerce.number().min(1, "Vui lòng chọn danh mục"),
  stock: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
  isFeatured: z.boolean().default(false),
  images: z.any().optional(),
});

type SampleProductFormValues = z.infer<typeof sampleProductSchema>;

export default function AdminSampleStorePage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  // Fetch sample store products
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-sample-products"],
    queryFn: getQueryFn({ url: "/api/admin/products/sample-store" }),
  });

  // Fetch categories for dropdown
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getQueryFn({ url: "/api/categories" }),
  });

  // Create form
  const form = useForm<SampleProductFormValues>({
    resolver: zodResolver(sampleProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discountedPrice: null,
      categoryId: 0,
      stock: 100,
      isFeatured: true,
      images: undefined,
    },
  });

  // Edit form
  const editForm = useForm<SampleProductFormValues>({
    resolver: zodResolver(sampleProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discountedPrice: null,
      categoryId: 0,
      stock: 100,
      isFeatured: true,
      images: undefined,
    },
  });

  // Create sample product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: SampleProductFormValues) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      if (data.discountedPrice) {
        formData.append("discountedPrice", String(data.discountedPrice));
      }
      formData.append("categoryId", String(data.categoryId));
      formData.append("stock", String(data.stock));
      formData.append("isFeatured", String(data.isFeatured));
      formData.append("isSampleStore", "true");
      
      if (data.images) {
        Array.from(data.images).forEach((file: File) => {
          formData.append("images", file);
        });
      }
      
      const res = await apiRequest("POST", "/api/admin/products/sample-store", formData, true);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sample-products"] });
      toast({
        title: "Tạo sản phẩm mẫu thành công",
        description: "Sản phẩm mẫu mới đã được thêm vào hệ thống",
      });
      setShowAddDialog(false);
      form.reset();
      setPreviewImage(null);
      setAdditionalImages([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Tạo sản phẩm mẫu thất bại",
        description: error.message || "Đã có lỗi xảy ra khi tạo sản phẩm mẫu",
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (data: SampleProductFormValues & { id: number }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      if (data.discountedPrice) {
        formData.append("discountedPrice", String(data.discountedPrice));
      }
      formData.append("categoryId", String(data.categoryId));
      formData.append("stock", String(data.stock));
      formData.append("isFeatured", String(data.isFeatured));
      formData.append("isSampleStore", "true");
      
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file: File) => {
          formData.append("images", file);
        });
      }
      
      const res = await apiRequest("PATCH", `/api/admin/products/sample-store/${data.id}`, formData, true);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sample-products"] });
      toast({
        title: "Cập nhật sản phẩm mẫu thành công",
        description: "Thông tin sản phẩm mẫu đã được cập nhật",
      });
      setShowEditDialog(false);
      setSelectedProduct(null);
      setPreviewImage(null);
      setAdditionalImages([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Cập nhật sản phẩm mẫu thất bại",
        description: error.message || "Đã có lỗi xảy ra khi cập nhật sản phẩm mẫu",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/products/sample-store/${productId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sample-products"] });
      toast({
        title: "Xóa sản phẩm mẫu thành công",
        description: "Sản phẩm mẫu đã được xóa khỏi hệ thống",
      });
      setShowDeleteDialog(false);
      setSelectedProduct(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Xóa sản phẩm mẫu thất bại",
        description: error.message || "Đã có lỗi xảy ra khi xóa sản phẩm mẫu",
        variant: "destructive",
      });
    },
  });

  // Handle product creation
  const onCreateProduct = (data: SampleProductFormValues) => {
    createProductMutation.mutate(data);
    // After creating a product, refetch the sample products list
    refetch();
  };

  // Handle product update
  const onUpdateProduct = (data: SampleProductFormValues) => {
    if (!selectedProduct) return;
    updateProductMutation.mutate({ ...data, id: selectedProduct.id });
  };

  // Handle product deletion
  const onDeleteProduct = () => {
    if (!selectedProduct) return;
    deleteProductMutation.mutate(selectedProduct.id);
  };

  // When edit dialog opens, populate form with selected product data
  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    editForm.reset({
      name: product.name,
      description: product.description || "",
      price: product.price,
      discountedPrice: product.discountedPrice,
      categoryId: product.categoryId,
      stock: product.stock,
      isFeatured: product.isFeatured,
    });
    setPreviewImage(product.mainImage || null);
    setAdditionalImages(product.images?.map((img: any) => img.url) || []);
    setShowEditDialog(true);
  };

  // Handle image change and preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Preview first image
    const mainImageFile = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(mainImageFile);

    // Preview additional images
    const additionalImagePreviews: string[] = [];
    Array.from(files).slice(1).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        additionalImagePreviews.push(reader.result as string);
        if (additionalImagePreviews.length === files.length - 1) {
          setAdditionalImages(additionalImagePreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Filter products based on search query and tab
  const filteredProducts = products
    ? products
        .filter((product: any) => {
          // Filter by search query
          const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description &&
              product.description.toLowerCase().includes(searchQuery.toLowerCase()));

          // Filter by tab
          if (activeTab === "all") return matchesSearch;
          if (activeTab === "featured") return matchesSearch && product.isFeatured;
          if (activeTab === "discounted")
            return matchesSearch && product.discountedPrice && product.discountedPrice < product.price;

          return matchesSearch;
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

  return (
    <AdminLayout title="Quản lý cửa hàng mẫu">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sản phẩm mẫu</CardTitle>
              <CardDescription>
                Quản lý sản phẩm mẫu hiển thị cho người dùng mới
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <PackagePlus className="h-4 w-4" />
                  <span>Thêm sản phẩm mẫu</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm sản phẩm mẫu mới</DialogTitle>
                  <DialogDescription>
                    Điền thông tin để tạo sản phẩm mẫu hiển thị trên trang chủ
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onCreateProduct)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên sản phẩm</FormLabel>
                              <FormControl>
                                <Input placeholder="Ví dụ: Áo thun unisex" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Danh mục</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                >
                                  <option value="0">Chọn danh mục</option>
                                  {categories?.map((category: any) => (
                                    <option key={category.id} value={category.id}>
                                      {category.name}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Giá gốc (VND)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="100000"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="discountedPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Giá khuyến mãi (VND)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="80000"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => {
                                      const value = e.target.value === "" ? null : Number(e.target.value);
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số lượng tồn kho</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="100" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="isFeatured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Sản phẩm nổi bật</FormLabel>
                                <FormDescription>
                                  Hiển thị sản phẩm này trong mục "Sản phẩm nổi bật" trên trang chủ
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mô tả sản phẩm</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Mô tả chi tiết về sản phẩm"
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="images"
                          render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Hình ảnh sản phẩm</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleImageChange(e);
                                    }}
                                    {...fieldProps}
                                  />
                                  <FormDescription>
                                    Tải lên hình ảnh sản phẩm. Hình đầu tiên sẽ là hình ảnh chính.
                                  </FormDescription>
                                  <div className="grid grid-cols-3 gap-2 mt-4">
                                    {previewImage && (
                                      <div className="relative rounded-md overflow-hidden border border-border aspect-square">
                                        <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                                          Ảnh chính
                                        </div>
                                        <img
                                          src={previewImage}
                                          alt="Preview"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    {additionalImages.map((image, index) => (
                                      <div
                                        key={index}
                                        className="relative rounded-md overflow-hidden border border-border aspect-square"
                                      >
                                        <img
                                          src={image}
                                          alt={`Preview ${index + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddDialog(false);
                          form.reset();
                          setPreviewImage(null);
                          setAdditionalImages([]);
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        disabled={createProductMutation.isPending}
                      >
                        {createProductMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tạo...
                          </>
                        ) : (
                          "Tạo sản phẩm mẫu"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:space-x-2 mt-4">
            <div className="relative flex w-full max-w-sm items-center">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="featured">Nổi bật</TabsTrigger>
                <TabsTrigger value="discounted">Giảm giá</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
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
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Không tìm thấy sản phẩm nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product: any) => (
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
                            <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                              {product.description || "Không có mô tả"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Tags className="h-3 w-3" />
                          {product.category?.name || "Không có danh mục"}
                        </Badge>
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
                      <TableCell>
                        <Badge variant="outline">{product.stock}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {product.isFeatured && (
                            <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                              Nổi bật
                            </Badge>
                          )}
                          {product.discountedPrice && (
                            <Badge className="bg-green-50 text-green-800 border-green-200">
                              Giảm giá
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Mở menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem trên trang
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa sản phẩm
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm mẫu</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho sản phẩm mẫu {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onUpdateProduct)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={editForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên sản phẩm</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="0">Chọn danh mục</option>
                              {categories?.map((category: any) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={editForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giá gốc (VND)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editForm.control}
                        name="discountedPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giá khuyến mãi (VND)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? null : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={editForm.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số lượng tồn kho</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Sản phẩm nổi bật</FormLabel>
                            <FormDescription>
                              Hiển thị sản phẩm này trong mục "Sản phẩm nổi bật" trên trang chủ
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={editForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả sản phẩm</FormLabel>
                          <FormControl>
                            <Textarea
                              className="min-h-[120px]"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="images"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Hình ảnh sản phẩm</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                {previewImage && (
                                  <div className="relative rounded-md overflow-hidden border border-border aspect-square">
                                    <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                                      Ảnh chính
                                    </div>
                                    <img
                                      src={previewImage}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                {additionalImages.map((image, index) => (
                                  <div
                                    key={index}
                                    className="relative rounded-md overflow-hidden border border-border aspect-square"
                                  >
                                    <img
                                      src={image}
                                      alt={`Preview ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                              <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  onChange(e.target.files);
                                  handleImageChange(e);
                                }}
                                {...fieldProps}
                              />
                              <FormDescription>
                                Tải lên hình ảnh mới hoặc giữ nguyên hình ảnh hiện tại
                              </FormDescription>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditDialog(false);
                      setSelectedProduct(null);
                      setPreviewImage(null);
                      setAdditionalImages([]);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateProductMutation.isPending}
                  >
                    {updateProductMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa sản phẩm mẫu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm mẫu {selectedProduct?.name}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteProduct}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa sản phẩm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}