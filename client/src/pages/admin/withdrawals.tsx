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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Check,
  X,
  CircleDollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Store,
  ArrowUpDown,
  AlertTriangle,
  CreditCard,
  Building,
  Copy,
  Eye,
} from "lucide-react";

export default function AdminWithdrawalsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [sortOrder, setSortOrder] = useState<{ field: string; direction: "asc" | "desc" }>({
    field: "createdAt",
    direction: "desc",
  });
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [transferDetails, setTransferDetails] = useState("");

  // Fetch withdrawal requests
  const {
    data: withdrawals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-withdrawals", activeTab],
    queryFn: getQueryFn({ url: `/api/admin/withdrawals/${activeTab}` }),
  });

  // Approve withdrawal mutation
  const approveWithdrawalMutation = useMutation({
    mutationFn: async ({
      withdrawalId,
      transferDetails,
    }: {
      withdrawalId: number;
      transferDetails: string;
    }) => {
      const res = await apiRequest("PATCH", `/api/admin/withdrawals/${withdrawalId}/approve`, {
        transferDetails,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      toast({
        title: "Phê duyệt thành công",
        description: "Yêu cầu rút tiền đã được phê duyệt và xử lý",
      });
      setShowApproveDialog(false);
      setShowWithdrawalDialog(false);
      setSelectedWithdrawal(null);
      setTransferDetails("");
    },
    onError: (error: Error) => {
      toast({
        title: "Phê duyệt thất bại",
        description: error.message || "Đã có lỗi xảy ra khi phê duyệt yêu cầu rút tiền",
        variant: "destructive",
      });
    },
  });

  // Reject withdrawal mutation
  const rejectWithdrawalMutation = useMutation({
    mutationFn: async ({
      withdrawalId,
      reason,
    }: {
      withdrawalId: number;
      reason: string;
    }) => {
      const res = await apiRequest("PATCH", `/api/admin/withdrawals/${withdrawalId}/reject`, {
        reason,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      toast({
        title: "Từ chối thành công",
        description: "Yêu cầu rút tiền đã bị từ chối và người bán sẽ nhận được thông báo",
      });
      setShowRejectDialog(false);
      setShowWithdrawalDialog(false);
      setSelectedWithdrawal(null);
      setRejectionReason("");
    },
    onError: (error: Error) => {
      toast({
        title: "Từ chối thất bại",
        description: error.message || "Đã có lỗi xảy ra khi từ chối yêu cầu rút tiền",
        variant: "destructive",
      });
    },
  });

  // Handle withdrawal approval
  const handleApproveWithdrawal = () => {
    if (!selectedWithdrawal || !transferDetails) return;
    approveWithdrawalMutation.mutate({
      withdrawalId: selectedWithdrawal.id,
      transferDetails,
    });
  };

  // Handle withdrawal rejection
  const handleRejectWithdrawal = () => {
    if (!selectedWithdrawal || !rejectionReason) return;
    rejectWithdrawalMutation.mutate({
      withdrawalId: selectedWithdrawal.id,
      reason: rejectionReason,
    });
  };

  // Filter and sort withdrawals
  const filteredWithdrawals = withdrawals
    ? withdrawals
        .filter((withdrawal: any) => {
          return (
            String(withdrawal.amount).includes(searchQuery) ||
            withdrawal.seller?.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            withdrawal.bank?.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            withdrawal.bank?.accountNumber.includes(searchQuery)
          );
        })
        .sort((a: any, b: any) => {
          const field = sortOrder.field;
          if (field === "createdAt") {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder.direction === "asc" ? dateA - dateB : dateB - dateA;
          }
          if (field === "amount") {
            return sortOrder.direction === "asc"
              ? a.amount - b.amount
              : b.amount - a.amount;
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

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Thông tin đã được sao chép vào clipboard",
    });
  };

  return (
    <AdminLayout title="Quản lý yêu cầu rút tiền">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div>
              <CardTitle>Danh sách yêu cầu rút tiền</CardTitle>
              <CardDescription>
                Quản lý và xử lý các yêu cầu rút tiền từ người bán
              </CardDescription>
            </div>
            <div className="relative flex w-full max-w-sm items-center">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm yêu cầu..."
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
              <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
              <TabsTrigger value="approved">Đã xử lý</TabsTrigger>
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
                  Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
                </div>
              ) : filteredWithdrawals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Không có yêu cầu rút tiền nào chờ xử lý</h3>
                  <p className="text-muted-foreground mt-2">
                    Tất cả yêu cầu đã được xử lý. Kiểm tra lại sau khi có yêu cầu mới.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã yêu cầu</TableHead>
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
                        onClick={() => toggleSortOrder("amount")}
                      >
                        <div className="flex items-center">
                          Số tiền {getSortIndicator("amount")}
                        </div>
                      </TableHead>
                      <TableHead>Ngân hàng</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("createdAt")}
                      >
                        <div className="flex items-center">
                          Ngày yêu cầu {getSortIndicator("createdAt")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.map((withdrawal: any) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell>#{withdrawal.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={withdrawal.seller?.logo} />
                              <AvatarFallback>
                                <Store className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span>{withdrawal.seller?.storeName || "Không xác định"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {formatCurrency(withdrawal.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium">
                              {withdrawal.bank?.bankName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {withdrawal.bank?.accountNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(withdrawal.createdAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setShowWithdrawalDialog(true);
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
                                setSelectedWithdrawal(withdrawal);
                                setShowApproveDialog(true);
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setShowRejectDialog(true);
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
                  Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
                </div>
              ) : filteredWithdrawals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <CircleDollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Không có yêu cầu rút tiền nào đã xử lý</h3>
                  <p className="text-muted-foreground mt-2">
                    Chưa có yêu cầu rút tiền nào được xử lý trong hệ thống.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã yêu cầu</TableHead>
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
                        onClick={() => toggleSortOrder("amount")}
                      >
                        <div className="flex items-center">
                          Số tiền {getSortIndicator("amount")}
                        </div>
                      </TableHead>
                      <TableHead>Chi tiết chuyển khoản</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("createdAt")}
                      >
                        <div className="flex items-center">
                          Ngày xử lý {getSortIndicator("createdAt")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.map((withdrawal: any) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell>#{withdrawal.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={withdrawal.seller?.logo} />
                              <AvatarFallback>
                                <Store className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span>{withdrawal.seller?.storeName || "Không xác định"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {formatCurrency(withdrawal.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs line-clamp-2">
                            {withdrawal.transferDetails || "Không có thông tin"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(withdrawal.updatedAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setShowWithdrawalDialog(true);
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
                  Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
                </div>
              ) : filteredWithdrawals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <XCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Không có yêu cầu rút tiền nào bị từ chối</h3>
                  <p className="text-muted-foreground mt-2">
                    Chưa có yêu cầu rút tiền nào bị từ chối trong hệ thống.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã yêu cầu</TableHead>
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
                        onClick={() => toggleSortOrder("amount")}
                      >
                        <div className="flex items-center">
                          Số tiền {getSortIndicator("amount")}
                        </div>
                      </TableHead>
                      <TableHead>Lý do từ chối</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSortOrder("createdAt")}
                      >
                        <div className="flex items-center">
                          Ngày từ chối {getSortIndicator("createdAt")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.map((withdrawal: any) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell>#{withdrawal.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={withdrawal.seller?.logo} />
                              <AvatarFallback>
                                <Store className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span>{withdrawal.seller?.storeName || "Không xác định"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {formatCurrency(withdrawal.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs line-clamp-2">
                            {withdrawal.rejectionReason || "Không có lý do được ghi nhận"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(withdrawal.updatedAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setShowWithdrawalDialog(true);
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
                                setSelectedWithdrawal(withdrawal);
                                setShowApproveDialog(true);
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

      {/* Withdrawal Detail Dialog */}
      <Dialog open={showWithdrawalDialog} onOpenChange={setShowWithdrawalDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu rút tiền #{selectedWithdrawal?.id}</DialogTitle>
            <DialogDescription>
              Xem chi tiết yêu cầu rút tiền
            </DialogDescription>
          </DialogHeader>
          
          {selectedWithdrawal && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Thông tin chung</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Mã yêu cầu</div>
                      <div className="font-medium">#{selectedWithdrawal.id}</div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-start">
                      <div className="text-sm text-muted-foreground">Trạng thái</div>
                      <Badge
                        className={
                          selectedWithdrawal.status === "pending"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : selectedWithdrawal.status === "approved"
                            ? "bg-green-50 text-green-800 border-green-200"
                            : "bg-red-50 text-red-800 border-red-200"
                        }
                      >
                        {selectedWithdrawal.status === "pending"
                          ? "Chờ xử lý"
                          : selectedWithdrawal.status === "approved"
                          ? "Đã xử lý"
                          : "Đã từ chối"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Số tiền yêu cầu</div>
                      <div className="font-bold text-lg">
                        {formatCurrency(selectedWithdrawal.amount)}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Ngày yêu cầu</div>
                      <div className="font-medium">
                        {new Date(selectedWithdrawal.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Cập nhật lần cuối</div>
                      <div className="font-medium">
                        {new Date(selectedWithdrawal.updatedAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Người bán</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedWithdrawal.seller?.logo} />
                        <AvatarFallback>
                          <Store className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold">
                          {selectedWithdrawal.seller?.storeName}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          {selectedWithdrawal.seller?.verified ? (
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
                    <Separator />
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Mô tả cửa hàng</div>
                      <div className="text-sm bg-muted/20 p-2 rounded-md">
                        {selectedWithdrawal.seller?.description || "Không có mô tả"}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Ngày tham gia</div>
                      <div className="font-medium">
                        {selectedWithdrawal.seller?.joinedAt
                          ? new Date(selectedWithdrawal.seller.joinedAt).toLocaleDateString("vi-VN")
                          : "Không xác định"}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">ID người dùng</div>
                      <div className="font-medium">
                        {selectedWithdrawal.seller?.userId || "Không xác định"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Thông tin ngân hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Ngân hàng</div>
                        <div className="flex items-center space-x-2">
                          <Building className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">
                            {selectedWithdrawal.bank?.bankName || "Không xác định"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Chi nhánh</div>
                        <div className="font-medium">
                          {selectedWithdrawal.bank?.bankBranch || "Không xác định"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Chủ tài khoản</div>
                        <div className="font-medium">
                          {selectedWithdrawal.bank?.accountName || "Không xác định"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Số tài khoản</div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{selectedWithdrawal.bank?.accountNumber || "Không xác định"}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(selectedWithdrawal.bank?.accountNumber)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {selectedWithdrawal.status === "approved" && (
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Chi tiết chuyển khoản</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/20 p-3 rounded-md">
                        {selectedWithdrawal.transferDetails || "Không có thông tin"}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {selectedWithdrawal.status === "rejected" && (
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Lý do từ chối</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-red-50 border border-red-200 p-3 rounded-md text-red-800">
                        {selectedWithdrawal.rejectionReason || "Không có lý do được ghi nhận"}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <DialogFooter>
                {selectedWithdrawal.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowWithdrawalDialog(false)}
                    >
                      Đóng
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setShowRejectDialog(true);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Từ chối
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setShowApproveDialog(true);
                      }}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Phê duyệt
                    </Button>
                  </>
                )}
                
                {selectedWithdrawal.status === "rejected" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowWithdrawalDialog(false)}
                    >
                      Đóng
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setShowApproveDialog(true);
                      }}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Phê duyệt lại
                    </Button>
                  </>
                )}
                
                {selectedWithdrawal.status === "approved" && (
                  <Button
                    variant="outline"
                    onClick={() => setShowWithdrawalDialog(false)}
                  >
                    Đóng
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Withdrawal Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận phê duyệt yêu cầu rút tiền</DialogTitle>
            <DialogDescription>
              {selectedWithdrawal && (
                <span>
                  Vui lòng xác nhận việc chuyển khoản số tiền{" "}
                  <span className="font-bold">{formatCurrency(selectedWithdrawal.amount)}</span> cho người bán{" "}
                  <span className="font-bold">{selectedWithdrawal.seller?.storeName}</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedWithdrawal && (
              <Card className="bg-muted/20">
                <CardContent className="space-y-3 pt-4">
                  <div className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Ngân hàng</div>
                    <div className="font-medium">
                      {selectedWithdrawal.bank?.bankName}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Chi nhánh</div>
                    <div className="font-medium">
                      {selectedWithdrawal.bank?.bankBranch}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Chủ tài khoản</div>
                    <div className="font-medium flex items-center space-x-2">
                      <span>{selectedWithdrawal.bank?.accountName}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(selectedWithdrawal.bank?.accountName)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Số tài khoản</div>
                    <div className="font-medium flex items-center space-x-2">
                      <span>{selectedWithdrawal.bank?.accountNumber}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(selectedWithdrawal.bank?.accountNumber)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Số tiền chuyển</div>
                    <div className="font-bold">
                      {formatCurrency(selectedWithdrawal.amount)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => copyToClipboard(String(selectedWithdrawal.amount))}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="space-y-2">
              <label htmlFor="transfer-details" className="text-sm font-medium">
                Chi tiết chuyển khoản
              </label>
              <Textarea
                id="transfer-details"
                placeholder="Ví dụ: Đã chuyển khoản qua internet banking với mã giao dịch 123456789"
                className="min-h-[100px]"
                value={transferDetails}
                onChange={(e) => setTransferDetails(e.target.value)}
              />
              {transferDetails.length === 0 && (
                <p className="text-sm text-red-500">Vui lòng nhập chi tiết chuyển khoản</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveDialog(false);
                setTransferDetails("");
              }}
            >
              Hủy
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApproveWithdrawal}
              disabled={approveWithdrawalMutation.isPending || !transferDetails}
            >
              {approveWithdrawalMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận đã chuyển khoản"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Withdrawal Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Từ chối yêu cầu rút tiền</DialogTitle>
            <DialogDescription>
              Vui lòng cung cấp lý do từ chối yêu cầu rút tiền này
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="rejection-reason" className="text-sm font-medium">
                Lý do từ chối
              </label>
              <Textarea
                id="rejection-reason"
                placeholder="Ví dụ: Thông tin tài khoản ngân hàng không chính xác, số tiền vượt quá số dư khả dụng, ..."
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
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectWithdrawal}
              disabled={rejectWithdrawalMutation.isPending || !rejectionReason}
            >
              {rejectWithdrawalMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Từ chối yêu cầu"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}