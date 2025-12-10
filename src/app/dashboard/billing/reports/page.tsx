"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    FileText,
    Download,
    Calendar,
    DollarSign,
    TrendingUp,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

interface Report {
    id: string;
    name: string;
    type: string;
    period: string;
    generatedAt: string;
    status: string;
    size: string;
}

const mockReports: Report[] = [
    { id: "1", name: "Monthly Revenue Report", type: "Revenue", period: "December 2024", generatedAt: "2024-12-09 10:30", status: "ready", size: "2.4 MB" },
    { id: "2", name: "Invoice Aging Report", type: "Accounts", period: "Q4 2024", generatedAt: "2024-12-08 14:15", status: "ready", size: "1.8 MB" },
    { id: "3", name: "Cost Analysis Report", type: "Analysis", period: "November 2024", generatedAt: "2024-12-01 09:00", status: "ready", size: "3.1 MB" },
    { id: "4", name: "Customer Billing Summary", type: "Summary", period: "2024 YTD", generatedAt: "2024-12-05 16:45", status: "ready", size: "5.2 MB" },
    { id: "5", name: "Tariff Comparison Report", type: "Analysis", period: "Q4 2024", generatedAt: "2024-12-07 11:20", status: "processing", size: "-" },
];

const monthlyRevenue = [
    { month: "Jul", revenue: 125000, expenses: 85000 },
    { month: "Aug", revenue: 142000, expenses: 92000 },
    { month: "Sep", revenue: 138000, expenses: 88000 },
    { month: "Oct", revenue: 156000, expenses: 98000 },
    { month: "Nov", revenue: 168000, expenses: 105000 },
    { month: "Dec", revenue: 185000, expenses: 112000 },
];

export default function BillingReportsPage() {
    const [reports] = useState<Report[]>(mockReports);

    const stats = {
        totalRevenue: 914000,
        avgMonthly: 152333,
        growth: 12.5,
        pendingPayments: 45600,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Billing Reports</h1>
                    <p className="text-gray-600">Financial reports and analytics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Select Period
                    </Button>
                    <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue (YTD)</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            +{stats.growth}% from last year
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Monthly Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.avgMonthly.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Last 6 months</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">${stats.pendingPayments.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">23 invoices</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
                        <FileText className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reports.length}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Revenue vs Expenses
                        </CardTitle>
                        <CardDescription>Last 6 months comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {monthlyRevenue.map((item) => (
                                <div key={item.month} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{item.month}</span>
                                        <span className="text-green-600">+${((item.revenue - item.expenses) / 1000).toFixed(0)}k profit</span>
                                    </div>
                                    <div className="flex gap-1 h-4">
                                        <div
                                            className="bg-blue-500 rounded"
                                            style={{ width: `${(item.revenue / 200000) * 100}%` }}
                                            title={`Revenue: $${item.revenue.toLocaleString()}`}
                                        />
                                        <div
                                            className="bg-gray-300 rounded"
                                            style={{ width: `${(item.expenses / 200000) * 100}%` }}
                                            title={`Expenses: $${item.expenses.toLocaleString()}`}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-4 text-sm pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded" />
                                    Revenue
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-300 rounded" />
                                    Expenses
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Revenue by Service Type
                        </CardTitle>
                        <CardDescription>Distribution of revenue sources</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { type: "Express Delivery", amount: 385000, percent: 42, color: "bg-blue-500" },
                                { type: "Standard Shipping", amount: 274000, percent: 30, color: "bg-green-500" },
                                { type: "Freight Services", amount: 165000, percent: 18, color: "bg-purple-500" },
                                { type: "Same Day", amount: 90000, percent: 10, color: "bg-orange-500" },
                            ].map((item) => (
                                <div key={item.type} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{item.type}</span>
                                        <span>${(item.amount / 1000).toFixed(0)}k ({item.percent}%)</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Generated Reports</CardTitle>
                    <CardDescription>Download or view previously generated reports.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Generated</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">{report.name}</TableCell>
                                    <TableCell><Badge variant="outline">{report.type}</Badge></TableCell>
                                    <TableCell>{report.period}</TableCell>
                                    <TableCell className="text-muted-foreground">{report.generatedAt}</TableCell>
                                    <TableCell>{report.size}</TableCell>
                                    <TableCell>
                                        <Badge variant={report.status === "ready" ? "default" : "secondary"}>
                                            {report.status === "ready" ? "Ready" : "Processing"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" disabled={report.status !== "ready"}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
