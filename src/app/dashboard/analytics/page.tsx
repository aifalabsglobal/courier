"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Truck,
  Package,
  DollarSign,
  Users,
  AlertTriangle,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

const monthlyRevenue = [
  { month: "Jan", revenue: 45000, orders: 120 },
  { month: "Feb", revenue: 52000, orders: 145 },
  { month: "Mar", revenue: 48000, orders: 130 },
  { month: "Apr", revenue: 61000, orders: 165 },
  { month: "May", revenue: 55000, orders: 150 },
  { month: "Jun", revenue: 67000, orders: 180 },
];

const orderStatusData = [
  { name: "Delivered", value: 450, color: "#22c55e" },
  { name: "In Transit", value: 120, color: "#3b82f6" },
  { name: "Pending", value: 80, color: "#f59e0b" },
  { name: "Cancelled", value: 25, color: "#ef4444" },
];

const vehicleUtilization = [
  { vehicle: "TRUCK-101", utilization: 85, status: "Active" },
  { vehicle: "VAN-205", utilization: 72, status: "Active" },
  { vehicle: "TRUCK-309", utilization: 45, status: "Maintenance" },
  { vehicle: "TRUCK-402", utilization: 90, status: "Active" },
  { vehicle: "VAN-505", utilization: 60, status: "Active" },
];

const topCustomers = [
  { name: "Acme Corporation", orders: 45, revenue: 125000 },
  { name: "Global Logistics", orders: 38, revenue: 98000 },
  { name: "Fast Shipping Co", orders: 32, revenue: 76000 },
  { name: "Tech Solutions", orders: 28, revenue: 69000 },
  { name: "Supply Chain Inc", orders: 25, revenue: 62000 },
];

const performanceMetrics = [
  { metric: "On-Time Delivery", current: 94.2, target: 95, trend: "up" },
  { metric: "Vehicle Utilization", current: 78.5, target: 85, trend: "up" },
  { metric: "Order Accuracy", current: 98.1, target: 99, trend: "down" },
  { metric: "Cost per Mile", current: 2.45, target: 2.20, trend: "down" },
];

export default function AnalyticsPage() {
  const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
  const totalOrders = monthlyRevenue.reduce((sum, month) => sum + month.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const activeVehicles = vehicleUtilization.filter(v => v.status === "Active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into your logistics operations</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (YTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-600">85%</span> utilization rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+4.1%</span> from last year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Orders Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                  contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current order status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Metrics</CardTitle>
          <CardDescription>Core operational metrics vs targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  <div className="flex items-center">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {metric.current}%{metric.metric === "Cost per Mile" && ""}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Current</span>
                    <span>Target: {metric.target}%{metric.metric === "Cost per Mile" && ""}</span>
                  </div>
                  <Progress 
                    value={(metric.current / metric.target) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Utilization and Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Utilization</CardTitle>
            <CardDescription>Current utilization rates by vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicleUtilization.map((vehicle, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{vehicle.vehicle}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{vehicle.utilization}%</span>
                      <Badge variant={vehicle.status === "Active" ? "default" : "secondary"}>
                        {vehicle.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={vehicle.utilization} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest revenue customers this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.orders} orders</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${customer.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Alerts</CardTitle>
          <CardDescription>Issues requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="font-medium">Critical</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium">Vehicle TRUCK-309</div>
                  <div className="text-gray-500">Maintenance overdue by 5 days</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Order ORD-2024-007</div>
                  <div className="text-gray-500">Delivery delayed by 2 hours</div>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Warning</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium">Warehouse A</div>
                  <div className="text-gray-500">Inventory at 85% capacity</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Driver Mike Johnson</div>
                  <div className="text-gray-500">License expires in 30 days</div>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Info</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium">New Customer</div>
                  <div className="text-gray-500">Tech Solutions Inc registered</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Rate Update</div>
                  <div className="text-gray-500">Fuel surcharge increased by 2%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}