"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, TrendingUp, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

const billingItems = [
    {
        title: "Invoices",
        description: "Manage customer invoices and billing",
        icon: FileText,
        href: "/dashboard/billing/invoices",
        count: 234,
        badge: "12 Pending",
    },
];

const billingStats = [
    { label: "Total Outstanding", value: "$124,500", icon: DollarSign, trend: "+12%" },
    { label: "This Month Revenue", value: "$89,300", icon: TrendingUp, trend: "+8%" },
    { label: "Pending Invoices", value: "12", icon: Clock, trend: "-3" },
    { label: "Overdue", value: "4", icon: AlertCircle, trend: "+2" },
];

const recentInvoices = [
    { id: "INV-2024-001", customer: "Acme Corporation", amount: 15420, status: "paid", date: "2024-12-08" },
    { id: "INV-2024-002", customer: "Global Logistics", amount: 8750, status: "pending", date: "2024-12-07" },
    { id: "INV-2024-003", customer: "Fast Shipping Co", amount: 23100, status: "overdue", date: "2024-11-25" },
    { id: "INV-2024-004", customer: "Express Deliveries", amount: 5600, status: "paid", date: "2024-12-06" },
    { id: "INV-2024-005", customer: "Metro Transport", amount: 12300, status: "pending", date: "2024-12-05" },
];

const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        paid: "default",
        pending: "outline",
        overdue: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status.toUpperCase()}</Badge>;
};

export default function BillingPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Billing & Finance</h1>
                <p className="text-gray-600">Manage invoices, payments, and financial reports</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {billingStats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className={`text-xs ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.trend} from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {billingItems.map((item) => (
                    <Link key={item.title} href={item.href}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-2">{item.description}</CardDescription>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold">{item.count}</p>
                                        <p className="text-xs text-muted-foreground">Total invoices</p>
                                    </div>
                                    <Badge variant="outline">{item.badge}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Recent Invoices */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>Latest billing activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium">Invoice ID</th>
                                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                                    <th className="text-left py-3 px-4 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{invoice.id}</td>
                                        <td className="py-3 px-4">{invoice.customer}</td>
                                        <td className="py-3 px-4">${invoice.amount.toLocaleString()}</td>
                                        <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                                        <td className="py-3 px-4 text-muted-foreground">{invoice.date}</td>
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
