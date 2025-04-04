import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { insertCategorySchema } from "@shared/schema";
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SAMPLE_CATEGORIES } from "@/lib/constants";
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  PlusCircle,
  Loader2,
  Eye,
  Image,
  AlertTriangle,
} from "lucide-react";

// Form validation schema for category creation and editing
const categoryFormSchema = insertCategorySchema.extend({
  image: z.any().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch categories
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getQueryFn({ url: "/api/categories" }),
  });

  // Create form
  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      image: undefined,
    },
  });

  // Edit form
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      image: undefined,
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      
      if (data.description) {
        formData.append("description", data.description);
      }
      
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }
      
      const res = await apiRequest("POST", "/api/categories", formData, true);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({
        title: "Tạo danh mục thành công",
        description: "Danh mục mới đã được thêm vào hệ thống",
      });
      setShowAddDialog(false);
      createForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Tạo danh mục thất bại",
        description: error.message || "Đã có lỗi xảy ra khi tạo danh mục",
        variant: "destructive",
      });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues & { id: number }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      
      if (data.description) {
        formData.append("description", data.description);
      }
      
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }
      
      const res = await apiRequest("PATCH", `/api/categories/${data.id}`, formData, true);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({
        title: "Cập nhật danh mục thành công",
        description: "Thông tin danh mục đã được cập nhật",
      });
      setShowEditDialog(false);
      setSelectedCategory(null);
      setPreviewImage(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Cập nhật danh mục thất bại",
        description: error.message || "Đã có lỗi xảy ra khi cập nhật danh mục",
        variant: "destructive",
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      const res = await apiRequest("DELETE", `/api/categories/${categoryId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({
        title: "Xóa danh mục thành công",
        description: "Danh mục đã được xóa khỏi hệ thống",
      });
      setShowDeleteDialog(false);
      setSelectedCategory(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Xóa danh mục thất bại",
        description: error.message || "Đã có lỗi xảy ra khi xóa danh mục",
        variant: "destructive",
      });
    },
  });

  // Handle category creation
  const onCreateCategory = (data: CategoryFormValues) => {
    createCategoryMutation.mutate(data);
  };

  // Handle category update
  const onUpdateCategory = (data: CategoryFormValues) => {
    if (!selectedCategory) return;
    updateCategoryMutation.mutate({ ...data, id: selectedCategory.id });
  };

  // Handle category deletion
  const onDeleteCategory = () => {
    if (!selectedCategory) return;
    deleteCategoryMutation.mutate(selectedCategory.id);
  };

  // When edit dialog opens, populate form with selected category data
  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    editForm.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setPreviewImage(category.image || null);
    setShowEditDialog(true);
  };

  // Handle image change and preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, formType: 'create' | 'edit') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories
    ? categories.filter((category: any) => {
        return (
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (category.description &&
            category.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
    : [];

  // Create a slug from category name
  const handleGenerateSlug = (name: string, formType: 'create' | 'edit') => {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
    
    if (formType === 'create') {
      createForm.setValue("slug", slug);
    } else {
      editForm.setValue("slug", slug);
    }
  };

  return (
    <AdminLayout title="Quản lý danh mục">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách danh mục</CardTitle>
              <CardDescription>
                Quản lý tất cả danh mục sản phẩm trong hệ thống
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Thêm danh mục</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm danh mục mới</DialogTitle>
                  <DialogDescription>
                    Điền thông tin để tạo danh mục sản phẩm mới
                  </DialogDescription>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateCategory)} className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên danh mục</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ví dụ: Thời trang nam" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                if (e.target.value) {
                                  handleGenerateSlug(e.target.value, 'create');
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="thoi-trang-nam" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL thân thiện cho danh mục. Chỉ sử dụng chữ thường, số và dấu gạch ngang.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Mô tả ngắn gọn về danh mục này"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="image"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Hình ảnh danh mục</FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  onChange(e.target.files);
                                  handleImageChange(e, 'create');
                                }}
                                {...fieldProps}
                              />
                              {previewImage && (
                                <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border border-border">
                                  <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Tải lên hình ảnh đại diện cho danh mục
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowAddDialog(false);
                          createForm.reset();
                          setPreviewImage(null);
                        }}
                      >
                        Hủy
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createCategoryMutation.isPending}
                      >
                        {createCategoryMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tạo...
                          </>
                        ) : (
                          "Tạo danh mục"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="relative flex w-full max-w-sm items-center mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Đã có lỗi xảy ra khi tải dữ liệu danh mục. Vui lòng thử lại sau.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số sản phẩm</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Không tìm thấy danh mục nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category: any) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {category.image ? (
                            <div className="h-8 w-8 rounded-md overflow-hidden">
                              <img 
                                src={category.image} 
                                alt={category.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.slug}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="line-clamp-1 max-w-xs">
                          {category.description || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge>{category.productCount || 0}</Badge>
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
                            <DropdownMenuItem onClick={() => handleEditCategory(category)}>
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
                                setSelectedCategory(category);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa danh mục
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

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho danh mục {selectedCategory?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onUpdateCategory)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên danh mục</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value) {
                              handleGenerateSlug(e.target.value, 'edit');
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        URL thân thiện cho danh mục. Chỉ sử dụng chữ thường, số và dấu gạch ngang.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả ngắn gọn về danh mục này"
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
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Hình ảnh danh mục</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          {previewImage && (
                            <div className="relative w-full aspect-video rounded-md overflow-hidden border border-border">
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              onChange(e.target.files);
                              handleImageChange(e, 'edit');
                            }}
                            {...fieldProps}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Tải lên hình ảnh mới hoặc giữ nguyên hình ảnh hiện tại
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowEditDialog(false);
                      setSelectedCategory(null);
                      setPreviewImage(null);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit"
                    disabled={updateCategoryMutation.isPending}
                  >
                    {updateCategoryMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
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

      {/* Delete Category Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa danh mục</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa danh mục {selectedCategory?.name}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800">Cảnh báo</h3>
                  <div className="text-sm text-amber-700 mt-1">
                    Xóa danh mục sẽ ảnh hưởng đến tất cả sản phẩm thuộc danh mục này. Bạn có thể cân nhắc di chuyển sản phẩm sang danh mục khác trước khi xóa.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteCategory}
              disabled={deleteCategoryMutation.isPending}
            >
              {deleteCategoryMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa danh mục
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}