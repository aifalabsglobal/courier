import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
} from "lucide-react";

const stats = [
  {
    title: "Active Orders",
    value: "234",
    change: "+12%",
    changeType: "increase" as const,
    icon: Package,
  },
  {
    title: "Active Trips",
    value: "89",
    change: "+5%",
    changeType: "increase" as const,
    icon: Truck,
  },
  {
    title: "Revenue (MTD)",
    value: "$124,563",
    change: "+18%",
    changeType: "increase" as const,
    icon: DollarSign,
  },
  {
    title: "On-Time Delivery",
    value: "94.2%",
    change: "-2%",
    changeType: "decrease" as const,
    icon: BarChart3,
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Acme Corporation",
    status: "In Transit",
    priority: "High",
    value: "$2,450",
  },
  {
    id: "ORD-002",
    customer: "Global Logistics",
    status: "Delivered",
    priority: "Normal",
    value: "$1,200",
  },
  {
    id: "ORD-003",
    customer: "Fast Shipping Co",
    status: "Pending",
    priority: "Urgent",
    value: "$3,800",
  },
];

const activeTrips = [
  {
    id: "TRIP-001",
    vehicle: "Truck 101",
    driver: "John Doe",
    route: "New York → Boston",
    status: "In Transit",
    progress: 65,
  },
  {
    id: "TRIP-002",
    vehicle: "Van 205",
    driver: "Jane Smith",
    route: "Los Angeles → San Francisco",
    status: "Loading",
    progress: 25,
  },
  {
    id: "TRIP-003",
    vehicle: "Truck 309",
    driver: "Mike Johnson",
    route: "Chicago → Detroit",
    status: "Delivered",
    progress: 100,
  },
];

const alerts = [
  {
    type: "warning",
    message: "Vehicle 101 maintenance due in 5 days",
    time: "2 hours ago",
  },
  {
    type: "error",
    message: "Order ORD-003 delayed by 2 hours",
    time: "3 hours ago",
  },
  {
    type: "info",
    message: "New customer registration: Tech Solutions Inc",
    time: "5 hours ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening in your logistics operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.changeType === "increase" ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.changeType === "increase" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest order updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "In Transit"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                    <p className="text-sm font-medium">{order.value}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Trips */}
        <Card>
          <CardHeader>
            <CardTitle>Active Trips</CardTitle>
            <CardDescription>Live trip status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTrips.map((trip) => (
                <div key={trip.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{trip.id}</p>
                      <p className="text-sm text-gray-600">{trip.vehicle} • {trip.driver}</p>
                    </div>
                    <Badge
                      variant={
                        trip.status === "Delivered"
                          ? "default"
                          : trip.status === "In Transit"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {trip.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">{trip.route}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${trip.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Trips
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Important updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <AlertTriangle
                    className={`h-4 w-4 mt-0.5 ${
                      alert.type === "error"
                        ? "text-red-500"
                        : alert.type === "warning"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}