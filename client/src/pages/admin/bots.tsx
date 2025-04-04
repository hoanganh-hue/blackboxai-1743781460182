import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Bot,
  Edit,
  Trash2,
  PowerOff,
  Power,
  Plus,
  Check,
  Info,
  RefreshCw,
  Loader2,
  Radio,
  Search,
  ArrowUpDown,
  ChevronDown,
  Clock,
  Gift,
  Megaphone,
  CircleDollarSign,
  ShoppingCart,
  PackageOpen,
  User,
  Calendar,
  Eye,
  Settings,
  Cog,
  StopCircle,
  PlayCircle,
} from "lucide-react";

// Form validation schema for bot creation and editing
const botFormSchema = z.object({
  name: z.string().min(3, "Tên bot phải có ít nhất 3 ký tự"),
  description: z.string().min(10, "Mô tả bot phải có ít nhất 10 ký tự"),
  type: z.enum(["purchase", "notification", "promotional", "support"]),
  settings: z.record(z.any()).optional(),
  isActive: z.boolean().default(false),
});

type BotFormValues = z.infer<typeof botFormSchema>;

export default function AdminBotsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<{ field: string; direction: "asc" | "desc" }>({
    field: "createdAt",
    direction: "desc",
  });
  const [showAddBotDialog, setShowAddBotDialog] = useState(false);
  const [showEditBotDialog, setShowEditBotDialog] = useState(false);
  const [showDeleteBotDialog, setShowDeleteBotDialog] = useState(false);
  const [showBotDetailsDialog, setShowBotDetailsDialog] = useState(false);
  const [selectedBot, setSelectedBot] = useState<any>(null);

  // Fetch bots
  const {
    data: bots,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-bots"],
    queryFn: getQueryFn({ url: "/api/bots" }),
  });

  // Create bot form
  const createForm = useForm<BotFormValues>({
    resolver: zodResolver(botFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "purchase",
      isActive: false,
      settings: {},
    },
  });

  // Edit bot form
  const editForm = useForm<BotFormValues>({
    resolver: zodResolver(botFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "purchase",
      isActive: false,
      settings: {},
    },
  });

  // Create bot mutation
  const createBotMutation = useMutation({
    mutationFn: async (data: BotFormValues) => {
      const res = await apiRequest("POST", "/api/bots", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bots"] });
      toast({
        title: "Tạo bot thành công",
        description: "Bot mới đã được thêm vào hệ thống",
      });
      setShowAddBotDialog(false);
      createForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Tạo bot thất bại",
        description: error.message || "Đã có lỗi xảy ra khi tạo bot",
        variant: "destructive",
      });
    },
  });

  // Update bot mutation
  const updateBotMutation = useMutation({
    mutationFn: async (data: BotFormValues & { id: number }) => {
      const res = await apiRequest("PATCH", `/api/bots/${data.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bots"] });
      toast({
        title: "Cập nhật bot thành công",
        description: "Thông tin bot đã được cập nhật",
      });
      setShowEditBotDialog(false);
      setSelectedBot(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Cập nhật bot thất bại",
        description: error.message || "Đã có lỗi xảy ra khi cập nhật bot",
        variant: "destructive",
      });
    },
  });

  // Delete bot mutation
  const deleteBotMutation = useMutation({
    mutationFn: async (botId: number) => {
      const res = await apiRequest("DELETE", `/api/bots/${botId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bots"] });
      toast({
        title: "Xóa bot thành công",
        description: "Bot đã được xóa khỏi hệ thống",
      });
      setShowDeleteBotDialog(false);
      setSelectedBot(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Xóa bot thất bại",
        description: error.message || "Đã có lỗi xảy ra khi xóa bot",
        variant: "destructive",
      });
    },
  });

  // Activate/deactivate bot mutation
  const toggleBotStatusMutation = useMutation({
    mutationFn: async ({ botId, active }: { botId: number; active: boolean }) => {
      const url = active
        ? `/api/bots/${botId}/activate`
        : `/api/bots/${botId}/deactivate`;
      const res = await apiRequest("PATCH", url);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bots"] });
      toast({
        title: "Cập nhật trạng thái thành công",
        description: "Trạng thái hoạt động của bot đã được cập nhật",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cập nhật trạng thái thất bại",
        description: error.message || "Đã có lỗi xảy ra khi cập nhật trạng thái bot",
        variant: "destructive",
      });
    },
  });

  // When edit dialog opens, populate form with selected bot data
  const handleEditBot = (bot: any) => {
    setSelectedBot(bot);
    editForm.reset({
      name: bot.name,
      description: bot.description || "",
      type: bot.type,
      isActive: bot.isActive,
      settings: bot.settings || {},
    });
    setShowEditBotDialog(true);
  };

  // Handle bot creation
  const onCreateBot = (data: BotFormValues) => {
    createBotMutation.mutate(data);
  };

  // Handle bot update
  const onUpdateBot = (data: BotFormValues) => {
    if (!selectedBot) return;
    updateBotMutation.mutate({ ...data, id: selectedBot.id });
  };

  // Handle bot deletion
  const onDeleteBot = () => {
    if (!selectedBot) return;
    deleteBotMutation.mutate(selectedBot.id);
  };

  // Handle bot activation/deactivation
  const handleToggleBotStatus = (bot: any) => {
    toggleBotStatusMutation.mutate({
      botId: bot.id,
      active: !bot.isActive,
    });
  };

  // Filter and sort bots
  const filteredBots = bots
    ? bots
        .filter((bot: any) => {
          // Filter by search query
          const matchesSearch =
            bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (bot.description &&
              bot.description.toLowerCase().includes(searchQuery.toLowerCase()));

          // Filter by tab
          if (activeTab === "all") return matchesSearch;
          if (activeTab === "active") return matchesSearch && bot.isActive;
          if (activeTab === "inactive") return matchesSearch && !bot.isActive;
          if (activeTab === bot.type) return matchesSearch;

          return matchesSearch;
        })
        .sort((a: any, b: any) => {
          const field = sortOrder.field;
          if (field === "createdAt") {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder.direction === "asc" ? dateA - dateB : dateB - dateA;
          }
          if (field === "name") {
            return sortOrder.direction === "asc"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          }
          if (field === "type") {
            return sortOrder.direction === "asc"
              ? a.type.localeCompare(b.type)
              : b.type.localeCompare(a.type);
          }
          if (field === "status") {
            const statusA = a.isActive ? 1 : 0;
            const statusB = b.isActive ? 1 : 0;
            return sortOrder.direction === "asc"
              ? statusA - statusB
              : statusB - statusA;
          }
          return 0;
        })
    : [];

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

  // Get bot type badge
  const getBotTypeBadge = (type: string) => {
    switch (type) {
      case "purchase":
        return (
          <Badge className="bg-blue-50 text-blue-800 border-blue-200">
            <ShoppingCart className="h-3 w-3 mr-1" />
            Mua hàng
          </Badge>
        );
      case "notification":
        return (
          <Badge className="bg-purple-50 text-purple-800 border-purple-200">
            <Megaphone className="h-3 w-3 mr-1" />
            Thông báo
          </Badge>
        );
      case "promotional":
        return (
          <Badge className="bg-green-50 text-green-800 border-green-200">
            <Gift className="h-3 w-3 mr-1" />
            Khuyến mãi
          </Badge>
        );
      case "support":
        return (
          <Badge className="bg-amber-50 text-amber-800 border-amber-200">
            <User className="h-3 w-3 mr-1" />
            Hỗ trợ
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Bot className="h-3 w-3 mr-1" />
            {type}
          </Badge>
        );
    }
  };

  // Get bot status badge
  const getBotStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-50 text-green-800 border-green-200">
        <Check className="h-3 w-3 mr-1" />
        Hoạt động
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-slate-50 text-slate-800 border-slate-200">
        <Clock className="h-3 w-3 mr-1" />
        Không hoạt động
      </Badge>
    );
  };

  // Get bot type description
  const getBotTypeDescription = (type: string) => {
    switch (type) {
      case "purchase":
        return "Bot mua hàng tự động theo thông tin được cấu hình";
      case "notification":
        return "Bot gửi thông báo cho người dùng, người bán hoặc quản trị viên";
      case "promotional":
        return "Bot quảng cáo và đề xuất sản phẩm, khuyến mãi cho người dùng";
      case "support":
        return "Bot hỗ trợ khách hàng và trả lời các câu hỏi thường gặp";
      default:
        return "Loại bot không xác định";
    }
  };

  // Get bot type icon
  const getBotTypeIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ShoppingCart className="h-5 w-5" />;
      case "notification":
        return <Megaphone className="h-5 w-5" />;
      case "promotional":
        return <Gift className="h-5 w-5" />;
      case "support":
        return <User className="h-5 w-5" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };

  return (
    <AdminLayout title="Quản lý Bot">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div>
              <CardTitle>Danh sách Bot</CardTitle>
              <CardDescription>
                Quản lý các bot tự động trong hệ thống TikTok Shop
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative flex w-full max-w-sm items-center">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bot..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={showAddBotDialog} onOpenChange={setShowAddBotDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm Bot
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Thêm Bot mới</DialogTitle>
                    <DialogDescription>
                      Điền thông tin để tạo một bot mới cho hệ thống TikTok Shop
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...createForm}>
                    <form onSubmit={createForm.handleSubmit(onCreateBot)} className="space-y-4">
                      <FormField
                        control={createForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên Bot</FormLabel>
                            <FormControl>
                              <Input placeholder="Ví dụ: Bot mua hàng tự động" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loại Bot</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn loại bot" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="purchase">
                                  <div className="flex items-center">
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    <span>Bot mua hàng</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="notification">
                                  <div className="flex items-center">
                                    <Megaphone className="h-4 w-4 mr-2" />
                                    <span>Bot thông báo</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="promotional">
                                  <div className="flex items-center">
                                    <Gift className="h-4 w-4 mr-2" />
                                    <span>Bot khuyến mãi</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="support">
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    <span>Bot hỗ trợ</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {getBotTypeDescription(field.value)}
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
                            <FormLabel>Mô tả Bot</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Mô tả chức năng và nhiệm vụ của bot"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Kích hoạt Bot</FormLabel>
                              <FormDescription>
                                Bot sẽ chạy ngay sau khi được tạo nếu được kích hoạt
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowAddBotDialog(false);
                            createForm.reset();
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          disabled={createBotMutation.isPending}
                        >
                          {createBotMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang tạo...
                            </>
                          ) : (
                            "Tạo Bot"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="mt-4">
            <TabsList className="w-full md:w-auto grid md:inline-grid grid-cols-4 md:grid-cols-6">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="active">Hoạt động</TabsTrigger>
              <TabsTrigger value="inactive">Không hoạt động</TabsTrigger>
              <TabsTrigger value="purchase">Mua hàng</TabsTrigger>
              <TabsTrigger value="notification">Thông báo</TabsTrigger>
              <TabsTrigger value="promotional">Khuyến mãi</TabsTrigger>
            </TabsList>
          </Tabs>
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
              Đã có lỗi xảy ra khi tải dữ liệu bot. Vui lòng thử lại sau.
            </div>
          ) : filteredBots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Không tìm thấy bot nào</h3>
              <p className="text-muted-foreground mt-2">
                Thử tìm kiếm với từ khóa khác hoặc thêm bot mới.
              </p>
              <Button
                onClick={() => setShowAddBotDialog(true)}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm Bot mới
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSortOrder("name")}
                  >
                    <div className="flex items-center">
                      Bot {getSortIndicator("name")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSortOrder("type")}
                  >
                    <div className="flex items-center">
                      Loại {getSortIndicator("type")}
                    </div>
                  </TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSortOrder("status")}
                  >
                    <div className="flex items-center">
                      Trạng thái {getSortIndicator("status")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSortOrder("createdAt")}
                  >
                    <div className="flex items-center">
                      Ngày tạo {getSortIndicator("createdAt")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBots.map((bot: any) => (
                  <TableRow key={bot.id}>
                    <TableCell>
                      <div className="font-medium">{bot.name}</div>
                    </TableCell>
                    <TableCell>{getBotTypeBadge(bot.type)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs line-clamp-2">
                        {bot.description || "Không có mô tả"}
                      </div>
                    </TableCell>
                    <TableCell>{getBotStatusBadge(bot.isActive)}</TableCell>
                    <TableCell>
                      {new Date(bot.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className={bot.isActive ? "text-red-500" : "text-green-500"}
                                onClick={() => handleToggleBotStatus(bot)}
                                disabled={toggleBotStatusMutation.isPending}
                              >
                                {toggleBotStatusMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : bot.isActive ? (
                                  <StopCircle className="h-4 w-4" />
                                ) : (
                                  <PlayCircle className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {bot.isActive ? "Dừng bot" : "Kích hoạt bot"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setSelectedBot(bot);
                                  setShowBotDetailsDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Xem chi tiết
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditBot(bot)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Chỉnh sửa
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500"
                                onClick={() => {
                                  setSelectedBot(bot);
                                  setShowDeleteBotDialog(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Xóa bot
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Bot Dialog */}
      <Dialog open={showEditBotDialog} onOpenChange={setShowEditBotDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Bot</DialogTitle>
            <DialogDescription>
              {selectedBot && `Cập nhật thông tin cho bot "${selectedBot.name}"`}
            </DialogDescription>
          </DialogHeader>
          {selectedBot && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onUpdateBot)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên Bot</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại Bot</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="purchase">
                            <div className="flex items-center">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              <span>Bot mua hàng</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="notification">
                            <div className="flex items-center">
                              <Megaphone className="h-4 w-4 mr-2" />
                              <span>Bot thông báo</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="promotional">
                            <div className="flex items-center">
                              <Gift className="h-4 w-4 mr-2" />
                              <span>Bot khuyến mãi</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="support">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <span>Bot hỗ trợ</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {getBotTypeDescription(field.value)}
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
                      <FormLabel>Mô tả Bot</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Kích hoạt Bot</FormLabel>
                        <FormDescription>
                          Bot sẽ hoạt động ngay sau khi lưu thay đổi nếu được kích hoạt
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditBotDialog(false);
                      setSelectedBot(null);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateBotMutation.isPending}
                  >
                    {updateBotMutation.isPending ? (
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

      {/* Delete Bot Dialog */}
      <Dialog open={showDeleteBotDialog} onOpenChange={setShowDeleteBotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa Bot</DialogTitle>
            <DialogDescription>
              {selectedBot && (
                <span>
                  Bạn có chắc chắn muốn xóa bot "{selectedBot.name}"? Hành động này không thể hoàn tác.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800">Cảnh báo</h3>
                  <div className="text-sm text-amber-700 mt-1">
                    Xóa bot sẽ dừng tất cả hoạt động đang chạy và xóa tất cả dữ liệu liên quan đến bot này.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteBotDialog(false);
                setSelectedBot(null);
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteBot}
              disabled={deleteBotMutation.isPending}
            >
              {deleteBotMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa bot"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bot Details Dialog */}
      <Dialog open={showBotDetailsDialog} onOpenChange={setShowBotDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Bot</DialogTitle>
            <DialogDescription>
              {selectedBot && `Thông tin chi tiết về bot "${selectedBot.name}"`}
            </DialogDescription>
          </DialogHeader>
          {selectedBot && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">ID Bot</div>
                      <div className="font-medium">#{selectedBot.id}</div>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Tên Bot</div>
                      <div className="font-medium">{selectedBot.name}</div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-start">
                      <div className="text-sm text-muted-foreground">Loại Bot</div>
                      <div>{getBotTypeBadge(selectedBot.type)}</div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-start">
                      <div className="text-sm text-muted-foreground">Trạng thái</div>
                      <div>{getBotStatusBadge(selectedBot.isActive)}</div>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Ngày tạo</div>
                      <div className="font-medium">
                        {new Date(selectedBot.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Cập nhật lần cuối</div>
                      <div className="font-medium">
                        {new Date(selectedBot.updatedAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Mô tả</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/20 p-3 rounded-md min-h-[120px]">
                      {selectedBot.description || "Không có mô tả"}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedBot.logs && selectedBot.logs.length > 0 ? (
                      <div className="space-y-2">
                        {selectedBot.logs.map((log: any, index: number) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <div className="text-muted-foreground whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString("vi-VN")}
                            </div>
                            <div>
                              <Badge
                                variant="outline"
                                className={
                                  log.level === "info"
                                    ? "bg-blue-50 text-blue-800 border-blue-200"
                                    : log.level === "warning"
                                    ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : log.level === "error"
                                    ? "bg-red-50 text-red-800 border-red-200"
                                    : "bg-green-50 text-green-800 border-green-200"
                                }
                              >
                                {log.level}
                              </Badge>
                              <span className="ml-2">{log.message}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        Không có hoạt động nào được ghi nhận
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Cài đặt thêm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedBot.settings && Object.keys(selectedBot.settings).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(selectedBot.settings).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex justify-between items-start border-b pb-2">
                            <div className="font-medium">{key}</div>
                            <div className="max-w-md text-right">
                              {typeof value === "object" ? (
                                <pre className="text-xs bg-muted/20 p-2 rounded-md overflow-auto">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              ) : (
                                <span className="text-muted-foreground">
                                  {String(value)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        Không có cài đặt thêm nào
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBotDetailsDialog(false);
                    setSelectedBot(null);
                  }}
                >
                  Đóng
                </Button>
                <Button
                  variant={selectedBot.isActive ? "destructive" : "default"}
                  onClick={() => handleToggleBotStatus(selectedBot)}
                  disabled={toggleBotStatusMutation.isPending}
                >
                  {toggleBotStatusMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : selectedBot.isActive ? (
                    <>
                      <StopCircle className="h-4 w-4 mr-1" />
                      Dừng Bot
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Kích hoạt Bot
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowBotDetailsDialog(false);
                    handleEditBot(selectedBot);
                  }}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Chỉnh sửa Bot
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}