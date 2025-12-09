"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, ArrowRightLeft, BarChart3 } from "lucide-react";
import Link from "next/link";

const warehouseItems = [
    {
        title: "Inventory",
        description: "View and manage stock levels across warehouses",
        icon: Package,
        href: "/dashboard/warehouse/inventory",
        count: 15420,
        unit: "SKUs",
    },
];

const warehouseStats = [
    { label: "Total Warehouses", value: "4", icon: MapPin },
    { label: "Total SKUs", value: "15,420", icon: Package },
    { label: "Transactions Today", value: "234", icon: ArrowRightLeft },
    { label: "Fill Rate", value: "87%", icon: BarChart3 },
];

const lowStockItems = [
    { sku: "SKU-001", name: "Premium Packaging Box L", warehouse: "Dallas DC", current: 45, reorder: 100 },
    { sku: "SKU-042", name: "Bubble Wrap Roll 50m", warehouse: "LA Fulfillment", current: 12, reorder: 50 },
    { sku: "SKU-089", name: "Pallet Stretch Film", warehouse: "Chicago Hub", current: 8, reorder: 25 },
    { sku: "SKU-156", name: "Shipping Labels 4x6", warehouse: "Dallas DC", current: 200, reorder: 500 },
];

const recentTransactions = [
    { id: "TXN001", type: "INBOUND", sku: "SKU-234", qty: 500, warehouse: "Dallas DC", time: "10 mins ago" },
    { id: "TXN002", type: "OUTBOUND", sku: "SKU-089", qty: 25, warehouse: "LA Fulfillment", time: "25 mins ago" },
    { id: "TXN003", type: "TRANSFER", sku: "SKU-156", qty: 200, warehouse: "Chicago Hub", time: "1 hr ago" },
    { id: "TXN004", type: "ADJUSTMENT", sku: "SKU-042", qty: -5, warehouse: "Dallas DC", time: "2 hrs ago" },
];

const getTransactionBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        INBOUND: "default",
        OUTBOUND: "secondary",
        TRANSFER: "outline",
        ADJUSTMENT: "destructive",
    };
    return <Badge variant={variants[type] || "outline"}>{type}</Badge>;
};

export default function WarehousePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
                <p className="text-gray-600">Monitor inventory levels and warehouse operations</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {warehouseStats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {warehouseItems.map((item) => (
                    <Link key={item.title} href={item.href}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-2">{item.description}</CardDescription>
                                <div>
                                    <p className="text-2xl font-bold">{item.count.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">{item.unit}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {/* Low Stock Alert Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Low Stock Alerts
                            <Badge variant="destructive">{lowStockItems.length}</Badge>
                        </CardTitle>
                        <CardDescription>Items below reorder point</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {lowStockItems.slice(0, 4).map((item) => (
                                <div key={item.sku} className="flex items-center justify-between text-sm">
                                    <div>
                                        <p className="font-medium">{item.sku}</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-red-500">{item.current}</p>
                                        <p className="text-xs text-muted-foreground">of {item.reorder}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest inventory movements</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                                    <th className="text-left py-3 px-4 font-medium">Type</th>
                                    <th className="text-left py-3 px-4 font-medium">SKU</th>
                                    <th className="text-left py-3 px-4 font-medium">Quantity</th>
                                    <th className="text-left py-3 px-4 font-medium">Warehouse</th>
                                    <th className="text-left py-3 px-4 font-medium">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map((txn) => (
                                    <tr key={txn.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{txn.id}</td>
                                        <td className="py-3 px-4">{getTransactionBadge(txn.type)}</td>
                                        <td className="py-3 px-4">{txn.sku}</td>
                                        <td className="py-3 px-4">
                                            <span className={txn.qty < 0 ? "text-red-500" : "text-green-500"}>
                                                {txn.qty > 0 ? "+" : ""}{txn.qty}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{txn.warehouse}</td>
                                        <td className="py-3 px-4 text-muted-foreground">{txn.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
