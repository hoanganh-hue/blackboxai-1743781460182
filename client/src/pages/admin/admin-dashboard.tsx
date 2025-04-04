import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp, 
  BarChart, 
  Download 
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

// Sample dashboard data
const sampleStats = {
  totalRevenue: 287654000,
  totalOrders: 1358,
  totalUsers: 4562,
  totalProducts: 863,
  pendingOrders: 42,
  pendingWithdrawals: 7,
  pendingProducts: 15
};

// Sample chart data
const sampleChartData = {
  revenue: [
    { date: "T1", amount: 25000000 },
    { date: "T2", amount: 32000000 },
    { date: "T3", amount: 28000000 },
    { date: "T4", amount: 35000000 },
    { date: "T5", amount: 42000000 },
    { date: "T6", amount: 48000000 },
    { date: "T7", amount: 52000000 },
    { date: "T8", amount: 58000000 },
    { date: "T9", amount: 62000000 },
    { date: "T10", amount: 68000000 },
    { date: "T11", amount: 75000000 },
    { date: "T12", amount: 92000000 }
  ],
  orders: [
    { date: "T1", count: 85 },
    { date: "T2", count: 102 },
    { date: "T3", count: 92 },
    { date: "T4", count: 115 },
    { date: "T5", count: 125 },
    { date: "T6", count: 138 },
    { date: "T7", count: 145 },
    { date: "T8", count: 156 },
    { date: "T9", count: 168 },
    { date: "T10", count: 172 },
    { date: "T11", count: 182 },
    { date: "T12", count: 198 }
  ]
};

export default function AdminDashboard() {
  const [periodFilter, setPeriodFilter] = useState("yearly");

  // Queries for dashboard data
  // These are disabled for now since we're using sample data
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/dashboard/stats"],
    enabled: false
  });

  const { data: chartData } = useQuery({
    queryKey: ["/api/admin/dashboard/chart", { period: periodFilter }],
    enabled: false
  });

  const displayStats = stats || sampleStats;
  const displayChartData = chartData || sampleChartData;

  // Format chart data for display
  const barChartData = displayChartData.revenue.map(item => ({
    name: item.date,
    value: item.amount / 1000000, // Convert to millions
  }));

  const lineChartData = displayChartData.orders.map(item => ({
    name: item.date,
    value: item.count
  }));

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng doanh thu</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(displayStats.totalRevenue)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-cyan-500/10 rounded-full">
                  <Package className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p>
                  <h3 className="text-2xl font-bold">{displayStats.totalOrders.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng người dùng</p>
                  <h3 className="text-2xl font-bold">{displayStats.totalUsers.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-500/10 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng sản phẩm</p>
                  <h3 className="text-2xl font-bold">{displayStats.totalProducts.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Actions */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Đơn hàng chờ xử lý</CardTitle>
                <CardDescription>Đơn hàng mới chưa được xử lý</CardDescription>
              </div>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.pendingOrders}</div>
              <Button variant="ghost" className="p-0 h-auto text-primary" size="sm">
                Xử lý đơn hàng
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Yêu cầu rút tiền</CardTitle>
                <CardDescription>Yêu cầu rút tiền đang chờ duyệt</CardDescription>
              </div>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.pendingWithdrawals}</div>
              <Button variant="ghost" className="p-0 h-auto text-primary" size="sm">
                Duyệt yêu cầu
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Sản phẩm chờ duyệt</CardTitle>
                <CardDescription>Sản phẩm mới cần duyệt</CardDescription>
              </div>
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.pendingProducts}</div>
              <Button variant="ghost" className="p-0 h-auto text-primary" size="sm">
                Duyệt sản phẩm
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={periodFilter === "monthly" ? "default" : "outline"} 
                size="sm"
                onClick={() => setPeriodFilter("monthly")}
              >
                Tháng
              </Button>
              <Button 
                variant={periodFilter === "yearly" ? "default" : "outline"} 
                size="sm"
                onClick={() => setPeriodFilter("yearly")}
              >
                Năm
              </Button>
            </div>
          </div>
          
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan doanh thu</CardTitle>
                <CardDescription>
                  Biểu đồ doanh thu theo {periodFilter === "monthly" ? "tháng" : "năm"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <div className="h-full w-full flex items-center justify-center">
                  <BarChart className="h-12 w-12 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Biểu đồ cột thể hiện doanh thu theo {periodFilter === "monthly" ? "ngày" : "tháng"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan đơn hàng</CardTitle>
                <CardDescription>
                  Biểu đồ số lượng đơn hàng theo {periodFilter === "monthly" ? "tháng" : "năm"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <div className="h-full w-full flex items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Biểu đồ đường thể hiện số lượng đơn hàng theo {periodFilter === "monthly" ? "ngày" : "tháng"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              10 hoạt động gần nhất trên hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                    {i % 2 === 0 ? (
                      <Package className="h-5 w-5 text-primary" />
                    ) : (
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {i % 2 === 0 
                        ? "Đơn hàng mới #12345 đã được tạo" 
                        : "Người bán mới đã đăng ký"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Date.now() - i * 3600000).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
