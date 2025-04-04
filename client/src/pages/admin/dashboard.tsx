import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getQueryFn } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  Users,
  ShoppingBag,
  Package,
  Store,
  CircleDollarSign,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Loader2,
  UserCheck,
  AlertTriangle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
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
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigationWithState } from "@/hooks/use-navigation-with-state";
import { ROUTES } from "@/lib/constants";

// Sample data for demo
const MONTHS = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
const CURRENT_MONTH = new Date().getMonth();

const recentMonths = MONTHS.slice(Math.max(0, CURRENT_MONTH - 5), CURRENT_MONTH + 1);

const sampleChartData = recentMonths.map((month, index) => ({
  name: month,
  revenue: Math.floor(Math.random() * 500000000) + 100000000,
  orders: Math.floor(Math.random() * 1000) + 200,
}));

const samplePieData = [
  { name: "Thời trang", value: 35 },
  { name: "Điện tử", value: 25 },
  { name: "Nội thất", value: 15 },
  { name: "Túi xách", value: 10 },
  { name: "Mỹ phẩm", value: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AdminDashboardPage() {
  const navigate = useNavigationWithState();
  
  // Fetch summary statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getQueryFn({ url: "/api/admin/stats" }),
  });

  // Fetch pending approval items
  const { data: pendingApprovals, isLoading: isLoadingApprovals } = useQuery({
    queryKey: ["admin-pending-approvals"],
    queryFn: getQueryFn({ url: "/api/admin/pending-approvals" }),
  });
  
  // Fetch recent orders
  const { data: recentOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: getQueryFn({ url: "/api/admin/orders/recent" }),
  });

  const isLoading = isLoadingStats || isLoadingApprovals || isLoadingOrders;

  // Format currency to US Dollars
  const formatCurrency = (value: number) => {
    // Giả định tỷ giá chuyển đổi từ VND sang USD (ví dụ: 1 USD = 24,000 VND)
    const usdValue = value / 24000;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(usdValue);
  };

  return (
    <AdminLayout title="Tổng quan hệ thống">
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-[120px]" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Skeleton className="h-[350px]" />
              <Skeleton className="h-[350px]" />
            </div>
            <Skeleton className="h-[400px]" />
          </div>
        ) : (
          <>
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.newUsersToday || 0} người dùng mới hôm nay
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.ordersToday || 0} đơn hàng mới hôm nay
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.pendingProducts || 0} sản phẩm chờ duyệt
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                  <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(stats?.revenueToday || 0)} hôm nay
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts for important tasks */}
            {pendingApprovals && pendingApprovals.pendingProducts > 0 && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle>Cần sự chú ý</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <div>Có {pendingApprovals.pendingProducts} sản phẩm và {pendingApprovals.pendingSellers} người bán đang chờ phê duyệt.</div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(ROUTES.ADMIN.PRODUCT_APPROVAL)}
                  >
                    Xem ngay
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {pendingApprovals && pendingApprovals.pendingWithdrawals > 0 && (
              <Alert className="bg-blue-50 border-blue-200">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertTitle>Yêu cầu rút tiền</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <div>Có {pendingApprovals.pendingWithdrawals} yêu cầu rút tiền đang chờ xử lý với tổng giá trị {formatCurrency(pendingApprovals.pendingWithdrawalAmount || 0)}.</div>
                  <Button 
                    size="sm"
                    onClick={() => navigate(ROUTES.ADMIN.WITHDRAWALS)}
                  >
                    Xử lý ngay
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Charts & Analytics */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo tháng</CardTitle>
                  <CardDescription>
                    Thống kê doanh thu 6 tháng gần nhất
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        width={500}
                        height={300}
                        data={sampleChartData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis 
                          tickFormatter={(value) => 
                            new Intl.NumberFormat('vi-VN', {
                              notation: 'compact',
                              compactDisplay: 'short',
                            }).format(value)
                          } 
                        />
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phân bố danh mục</CardTitle>
                  <CardDescription>
                    Tỷ lệ sản phẩm theo danh mục
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={samplePieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {samplePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Tabs defaultValue="orders">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">Đơn hàng gần đây</TabsTrigger>
                <TabsTrigger value="products">Sản phẩm mới</TabsTrigger>
                <TabsTrigger value="sellers">Người bán mới</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Đơn hàng mới nhất</CardTitle>
                    <CardDescription>
                      Danh sách các đơn hàng mới nhất trong hệ thống
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã đơn</TableHead>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>Thời gian</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">Giá trị</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders?.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{order.user.username}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleString('vi-VN')}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                order.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                                order.status === 'processing' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                order.status === 'shipped' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                                order.status === 'delivered' ? 'bg-green-50 text-green-800 border-green-200' :
                                'bg-red-50 text-red-800 border-red-200'
                              }>
                                {order.status === 'pending' ? 'Chờ xử lý' :
                                 order.status === 'processing' ? 'Đang xử lý' :
                                 order.status === 'shipped' ? 'Đang giao' :
                                 order.status === 'delivered' ? 'Đã giao' :
                                 'Đã hủy'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(ROUTES.ADMIN.ORDERS)}
                    >
                      Xem tất cả đơn hàng
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <CardTitle>Sản phẩm mới thêm</CardTitle>
                    <CardDescription>
                      Các sản phẩm mới được thêm vào hệ thống
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead>Người bán</TableHead>
                          <TableHead>Thời gian</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">Giá</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats?.recentProducts?.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.seller.storeName}</TableCell>
                            <TableCell>{new Date(product.createdAt).toLocaleString('vi-VN')}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                product.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                                product.status === 'approved' ? 'bg-green-50 text-green-800 border-green-200' :
                                'bg-red-50 text-red-800 border-red-200'
                              }>
                                {product.status === 'pending' ? 'Chờ duyệt' :
                                 product.status === 'approved' ? 'Đã duyệt' :
                                 'Từ chối'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(ROUTES.ADMIN.PRODUCTS)}
                    >
                      Xem tất cả sản phẩm
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="sellers">
                <Card>
                  <CardHeader>
                    <CardTitle>Người bán mới đăng ký</CardTitle>
                    <CardDescription>
                      Các người bán mới đăng ký gần đây
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cửa hàng</TableHead>
                          <TableHead>Chủ sở hữu</TableHead>
                          <TableHead>Ngày đăng ký</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats?.recentSellers?.map((seller) => (
                          <TableRow key={seller.id}>
                            <TableCell className="font-medium">{seller.storeName}</TableCell>
                            <TableCell>{seller.user.username}</TableCell>
                            <TableCell>{new Date(seller.createdAt).toLocaleString('vi-VN')}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                seller.verified ? 'bg-green-50 text-green-800 border-green-200' :
                                'bg-yellow-50 text-yellow-800 border-yellow-200'
                              }>
                                {seller.verified ? 'Đã xác minh' : 'Chờ xác minh'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`${ROUTES.ADMIN.SELLERS}/${seller.id}`)}
                              >
                                Chi tiết
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(ROUTES.ADMIN.SELLERS)}
                    >
                      Xem tất cả người bán
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  );
}