import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { USER_ROLES } from "@shared/schema";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  ShieldAlert,
  Shield,
  ShieldCheck,
  Search,
  Loader2,
  UserPlus,
  Undo2
} from "lucide-react";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  // Fetch users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users", roleFilter],
    queryFn: getQueryFn({ url: `/api/admin/users${roleFilter !== "all" ? `?role=${roleFilter}` : ""}` }),
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${userData.id}`, userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin người dùng đã được cập nhật",
      });
      setShowEditDialog(false);
      setShowRoleDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Cập nhật thất bại",
        description: error.message || "Đã có lỗi xảy ra khi cập nhật thông tin người dùng",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Xóa thành công",
        description: "Người dùng đã được xóa khỏi hệ thống",
      });
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Xóa thất bại",
        description: error.message || "Đã có lỗi xảy ra khi xóa người dùng",
        variant: "destructive",
      });
    },
  });

  // Filter users based on search query
  const filteredUsers = users ? users.filter((user: any) => {
    return (
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }) : [];

  const handleEditUser = () => {
    if (!selectedUser) return;
    
    updateUserMutation.mutate({
      id: selectedUser.id,
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      phoneNumber: selectedUser.phoneNumber,
    });
  };

  const handleChangeRole = (newRole: string) => {
    if (!selectedUser) return;
    
    updateUserMutation.mutate({
      id: selectedUser.id,
      role: newRole,
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return (
          <Badge className="bg-red-50 text-red-800 border-red-200">
            <ShieldAlert className="h-3 w-3 mr-1" />
            Quản trị viên
          </Badge>
        );
      case USER_ROLES.SELLER:
        return (
          <Badge className="bg-blue-50 text-blue-800 border-blue-200">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Người bán
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Shield className="h-3 w-3 mr-1" />
            Khách hàng
          </Badge>
        );
    }
  };

  return (
    <AdminLayout title="Quản lý người dùng">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách người dùng</CardTitle>
              <CardDescription>
                Quản lý tất cả người dùng trong hệ thống
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Thêm người dùng</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm người dùng mới</DialogTitle>
                  <DialogDescription>
                    Điền thông tin để thêm người dùng mới vào hệ thống
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Tên đăng nhập
                    </Label>
                    <Input id="username" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Mật khẩu
                    </Label>
                    <Input id="password" type="password" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Vai trò
                    </Label>
                    <select
                      id="role"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={USER_ROLES.CUSTOMER}>Khách hàng</option>
                      <option value={USER_ROLES.SELLER}>Người bán</option>
                      <option value={USER_ROLES.ADMIN}>Quản trị viên</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Hủy</Button>
                  <Button>Lưu người dùng</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" onValueChange={setRoleFilter}>
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value={USER_ROLES.CUSTOMER}>Khách hàng</TabsTrigger>
                <TabsTrigger value={USER_ROLES.SELLER}>Người bán</TabsTrigger>
                <TabsTrigger value={USER_ROLES.ADMIN}>Admin</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Đã có lỗi xảy ra khi tải dữ liệu người dùng. Vui lòng thử lại sau.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Không tìm thấy người dùng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.profileImage || ""} alt={user.username} />
                            <AvatarFallback>
                              {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.fullName || ""}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email || "—"}</TableCell>
                      <TableCell>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                          : "—"}
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.lastLogin ? "outline" : "secondary"}
                          className={
                            user.lastLogin
                              ? "bg-green-50 text-green-800 border-green-200"
                              : ""
                          }
                        >
                          {user.lastLogin ? "Hoạt động" : "Chưa đăng nhập"}
                        </Badge>
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
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRoleDialog(true);
                              }}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Thay đổi vai trò
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa người dùng
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

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho người dùng {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fullname" className="text-right">
                  Họ tên
                </Label>
                <Input
                  id="edit-fullname"
                  className="col-span-3"
                  value={selectedUser.fullName || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, fullName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  className="col-span-3"
                  value={selectedUser.email || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input
                  id="edit-phone"
                  className="col-span-3"
                  value={selectedUser.phoneNumber || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditDialog(false)}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleEditUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi vai trò người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật vai trò cho người dùng {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4">Vai trò hiện tại:</div>
                  {getRoleBadge(selectedUser.role)}
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Chọn vai trò mới:</Label>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={selectedUser.role === USER_ROLES.CUSTOMER ? "secondary" : "outline"}
                      className="justify-start"
                      onClick={() => handleChangeRole(USER_ROLES.CUSTOMER)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Khách hàng
                    </Button>
                    <Button
                      variant={selectedUser.role === USER_ROLES.SELLER ? "secondary" : "outline"}
                      className="justify-start"
                      onClick={() => handleChangeRole(USER_ROLES.SELLER)}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Người bán
                    </Button>
                    <Button
                      variant={selectedUser.role === USER_ROLES.ADMIN ? "secondary" : "outline"}
                      className="justify-start"
                      onClick={() => handleChangeRole(USER_ROLES.ADMIN)}
                    >
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Quản trị viên
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRoleDialog(false)}
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng {selectedUser?.username}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800">Cảnh báo</h3>
                  <div className="text-sm text-amber-700 mt-1">
                    Xóa người dùng sẽ:
                    <ul className="list-disc ml-5 mt-1">
                      <li>Xóa tất cả đơn hàng của họ</li>
                      <li>Xóa tất cả đánh giá của họ</li>
                      {selectedUser?.role === USER_ROLES.SELLER && (
                        <li>Xóa tất cả sản phẩm và cửa hàng của họ</li>
                      )}
                    </ul>
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
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa người dùng
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}