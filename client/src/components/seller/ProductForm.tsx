import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InsertProduct, insertProductSchema, PRODUCT_STATUS } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/lib/constants";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { generateSlug } from "@/lib/utils";
import { z } from "zod";
import { X, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

// Extend the product schema with some extra validations
const productFormSchema = insertProductSchema.extend({
  name: z.string().min(5, {
    message: "Tên sản phẩm phải có ít nhất 5 ký tự",
  }),
  description: z.string().min(20, {
    message: "Mô tả sản phẩm phải có ít nhất 20 ký tự",
  }),
  price: z.number().min(1000, {
    message: "Giá phải lớn hơn 1.000đ",
  }),
  discountedPrice: z.number().optional(),
  stock: z.number().min(1, {
    message: "Số lượng phải lớn hơn 0",
  }),
  images: z.array(z.string()).min(1, {
    message: "Phải có ít nhất một hình ảnh",
  }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  editProduct?: any; // For editing existing product
  onSuccess?: () => void;
}

export function ProductForm({ editProduct, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const [imageUrls, setImageUrls] = useState<string[]>(editProduct?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: [API_ENDPOINTS.CATEGORIES.BASE],
    // For now, we'll disable actual fetching since we don't have backend connected
    enabled: false
  });

  // Sample categories for UI display
  const sampleCategories = [
    { id: 1, name: "Thời trang", slug: "thoi-trang" },
    { id: 2, name: "Điện tử", slug: "dien-tu" },
    { id: 3, name: "Nội thất", slug: "noi-that" },
    { id: 4, name: "Mỹ phẩm", slug: "my-pham" },
    { id: 5, name: "Thực phẩm", slug: "thuc-pham" }
  ];

  // Default values for the form
  const defaultValues: Partial<ProductFormValues> = {
    name: editProduct?.name || "",
    description: editProduct?.description || "",
    price: editProduct?.price || 0,
    discountedPrice: editProduct?.discountedPrice || undefined,
    stock: editProduct?.stock || 1,
    categoryId: editProduct?.categoryId || undefined,
    isDiscounted: editProduct?.isDiscounted || false,
    isFeatured: editProduct?.isFeatured || false,
    status: editProduct?.status || PRODUCT_STATUS.PENDING,
    images: editProduct?.images || [],
  };

  // Form definition
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  // Create or update product mutation
  const mutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // For create
      if (!editProduct) {
        // Generate slug from name
        const slug = generateSlug(data.name);
        const response = await apiRequest(
          "POST",
          API_ENDPOINTS.PRODUCTS.BASE,
          { ...data, slug }
        );
        return response.json();
      } else {
        // For update
        const response = await apiRequest(
          "PATCH",
          API_ENDPOINTS.PRODUCTS.BY_ID(editProduct.id),
          data
        );
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: editProduct ? "Sản phẩm đã được cập nhật" : "Sản phẩm đã được tạo",
        description: editProduct
          ? "Thông tin sản phẩm đã được lưu thành công."
          : "Sản phẩm mới đã được tạo và đang chờ phê duyệt.",
      });
      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PRODUCTS.BASE] });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    // Add images to the form data
    data.images = imageUrls;
    mutation.mutate(data);
  };

  // Handler for adding new image URL
  const addImageUrl = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl("");
    }
  };

  // Handler for removing an image URL
  const removeImageUrl = (url: string) => {
    setImageUrls(imageUrls.filter((imageUrl) => imageUrl !== url));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{editProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</CardTitle>
        <CardDescription>
          {editProduct
            ? "Cập nhật thông tin sản phẩm của bạn."
            : "Thêm sản phẩm mới vào cửa hàng của bạn."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên sản phẩm" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tên sản phẩm sẽ được hiển thị trên trang sản phẩm.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết về sản phẩm"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Cung cấp mô tả đầy đủ về sản phẩm, bao gồm các đặc điểm và lợi ích.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập giá sản phẩm"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập số lượng sản phẩm"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục sản phẩm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(categories || sampleCategories).map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDiscounted"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex items-center gap-2 mt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Sản phẩm giảm giá</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("isDiscounted") && (
              <FormField
                control={form.control}
                name="discountedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá giảm (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập giá sau khi giảm"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Giá sau khi giảm phải thấp hơn giá gốc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Sản phẩm nổi bật</FormLabel>
                    <FormDescription>
                      Sản phẩm nổi bật sẽ được hiển thị trong phần "Sản phẩm nổi bật" trên trang chủ.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Image uploads */}
            <div className="space-y-4">
              <FormLabel>Hình ảnh sản phẩm</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Nhập URL hình ảnh"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addImageUrl}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" /> Thêm
                </Button>
              </div>
              
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Sản phẩm ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border border-border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImageUrl(url)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {form.formState.errors.images && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.images.message}
                </p>
              )}
            </div>

            <CardFooter className="px-0 pt-6">
              <Button
                type="submit"
                className="ml-auto"
                disabled={mutation.isPending}
              >
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editProduct ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
