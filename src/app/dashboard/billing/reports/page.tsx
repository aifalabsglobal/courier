"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Calendar, DollarSign, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Invoice { id: string; invoiceNo: string; invoiceDate: string; totalAmount: number; paidAmount: number; status: string; customer?: { name: string }; }

export default function BillingReportsPage() {
    const { toast } = useToast();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/invoices");
            if (res.ok) setInvoices(await res.json());
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const totalRevenue = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalPaid = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
    const outstanding = totalRevenue - totalPaid;
    const paidCount = invoices.filter(i => i.status === "PAID").length;
    const overdueCount = invoices.filter(i => i.status === "OVERDUE").length;

    // Monthly breakdown
    const monthlyData = invoices.reduce((acc, inv) => {
        const month = new Date(inv.invoiceDate).toLocaleString('default', { month: 'short' });
        if (!acc[month]) acc[month] = { revenue: 0, paid: 0 };
        acc[month].revenue += inv.totalAmount;
        acc[month].paid += inv.paidAmount;
        return acc;
    }, {} as Record<string, { revenue: number; paid: number }>);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Billing Reports</h1><p className="text-gray-600">Financial analytics and reports</p></div><Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button></div>

            {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                <>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle><DollarSign className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div><p className="text-xs text-muted-foreground">From {invoices.length} invoices</p></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Collected</CardTitle><TrendingUp className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">${totalPaid.toLocaleString()}</div><p className="text-xs text-muted-foreground">{paidCount} paid invoices</p></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Outstanding</CardTitle><FileText className="h-4 w-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-orange-600">${outstanding.toLocaleString()}</div><p className="text-xs text-muted-foreground">Pending collection</p></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Overdue</CardTitle><Calendar className="h-4 w-4 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{overdueCount}</div><p className="text-xs text-muted-foreground">Past due date</p></CardContent></Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Monthly Summary</CardTitle><CardDescription>Revenue by month</CardDescription></CardHeader><CardContent>
                            <Table><TableHeader><TableRow><TableHead>Month</TableHead><TableHead className="text-right">Revenue</TableHead><TableHead className="text-right">Collected</TableHead></TableRow></TableHeader><TableBody>
                                {Object.entries(monthlyData).map(([month, data]) => (<TableRow key={month}><TableCell className="font-medium">{month}</TableCell><TableCell className="text-right">${data.revenue.toLocaleString()}</TableCell><TableCell className="text-right text-green-600">${data.paid.toLocaleString()}</TableCell></TableRow>))}
                                {Object.keys(monthlyData).length === 0 && <TableRow><TableCell colSpan={3} className="text-center h-24">No data available</TableCell></TableRow>}
                            </TableBody></Table>
                        </CardContent></Card>

                        <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Recent Invoices</CardTitle><CardDescription>Latest billing activity</CardDescription></CardHeader><CardContent>
                            <Table><TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>
                                {invoices.slice(0, 5).map((inv) => (<TableRow key={inv.id}><TableCell className="font-medium">{inv.invoiceNo}</TableCell><TableCell>{inv.customer?.name || "-"}</TableCell><TableCell className="text-right">${inv.totalAmount.toLocaleString()}</TableCell><TableCell><Badge variant={inv.status === "PAID" ? "default" : inv.status === "OVERDUE" ? "destructive" : "secondary"}>{inv.status}</Badge></TableCell></TableRow>))}
                                {invoices.length === 0 && <TableRow><TableCell colSpan={4} className="text-center h-24">No invoices found</TableCell></TableRow>}
                            </TableBody></Table>
                        </CardContent></Card>
                    </div>

                    <Card><CardHeader><CardTitle>Available Reports</CardTitle><CardDescription>Download financial reports</CardDescription></CardHeader><CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="cursor-pointer hover:bg-muted/50 transition-colors"><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-blue-100"><FileText className="h-6 w-6 text-blue-600" /></div><div><h3 className="font-semibold">Revenue Report</h3><p className="text-sm text-muted-foreground">Monthly revenue summary</p></div></div></CardContent></Card>
                            <Card className="cursor-pointer hover:bg-muted/50 transition-colors"><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-green-100"><DollarSign className="h-6 w-6 text-green-600" /></div><div><h3 className="font-semibold">Collection Report</h3><p className="text-sm text-muted-foreground">Payment collection status</p></div></div></CardContent></Card>
                            <Card className="cursor-pointer hover:bg-muted/50 transition-colors"><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-orange-100"><Calendar className="h-6 w-6 text-orange-600" /></div><div><h3 className="font-semibold">Aging Report</h3><p className="text-sm text-muted-foreground">Outstanding dues by age</p></div></div></CardContent></Card>
                        </div>
                    </CardContent></Card>
                </>
            )}
        </div>
    );
}
