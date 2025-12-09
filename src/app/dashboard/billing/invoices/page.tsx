"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Eye, Download, DollarSign, FileText, AlertTriangle } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  currency: string;
  orderIds: string[];
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNo: "INV-2024-001",
    customerId: "1",
    customerName: "Acme Corporation",
    invoiceDate: "2024-01-01",
    dueDate: "2024-01-31",
    status: "PAID",
    subtotal: 5000,
    taxAmount: 500,
    totalAmount: 5500,
    paidAmount: 5500,
    balanceAmount: 0,
    currency: "USD",
    orderIds: ["ORD-2024-001", "ORD-2024-002"],
  },
  {
    id: "2",
    invoiceNo: "INV-2024-002",
    customerId: "2",
    customerName: "Global Logistics",
    invoiceDate: "2024-01-05",
    dueDate: "2024-02-05",
    status: "PARTIALLY_PAID",
    subtotal: 3200,
    taxAmount: 320,
    totalAmount: 3520,
    paidAmount: 2000,
    balanceAmount: 1520,
    currency: "USD",
    orderIds: ["ORD-2024-003"],
  },
  {
    id: "3",
    invoiceNo: "INV-2024-003",
    customerId: "3",
    customerName: "Fast Shipping Co",
    invoiceDate: "2024-01-10",
    dueDate: "2024-02-10",
    status: "UNPAID",
    subtotal: 1800,
    taxAmount: 180,
    totalAmount: 1980,
    paidAmount: 0,
    balanceAmount: 1980,
    currency: "USD",
    orderIds: ["ORD-2024-004"],
  },
  {
    id: "4",
    invoiceNo: "INV-2024-004",
    customerId: "1",
    customerName: "Acme Corporation",
    invoiceDate: "2024-01-12",
    dueDate: "2024-02-12",
    status: "OVERDUE",
    subtotal: 7500,
    taxAmount: 750,
    totalAmount: 8250,
    paidAmount: 0,
    balanceAmount: 8250,
    currency: "USD",
    orderIds: ["ORD-2024-005", "ORD-2024-006"],
  },
];

const invoiceStatuses = ["DRAFT", "SENT", "PAID", "PARTIALLY_PAID", "UNPAID", "OVERDUE", "CANCELLED"];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNo: "",
    customerId: "",
    customerName: "",
    invoiceDate: "",
    dueDate: "",
    status: "DRAFT",
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    paidAmount: 0,
    currency: "USD",
    orderIds: "",
  });

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNo: formData.invoiceNo,
      customerId: formData.customerId,
      customerName: formData.customerName,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      status: formData.status,
      subtotal: formData.subtotal,
      taxAmount: formData.taxAmount,
      totalAmount: formData.totalAmount,
      paidAmount: formData.paidAmount,
      balanceAmount: formData.totalAmount - formData.paidAmount,
      currency: formData.currency,
      orderIds: formData.orderIds.split(",").map(id => id.trim()),
    };
    setInvoices([...invoices, newInvoice]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (invoice: Invoice) => {
    // In a real app, this would open an edit dialog
    console.log("Edit invoice:", invoice);
  };

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  const handlePayment = (id: string, amount: number) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              paidAmount: inv.paidAmount + amount,
              balanceAmount: Math.max(0, inv.balanceAmount - amount),
              status: inv.balanceAmount - amount <= 0 ? "PAID" : "PARTIALLY_PAID",
            }
          : inv
      )
    );
  };

  const resetForm = () => {
    setFormData({
      invoiceNo: "",
      customerId: "",
      customerName: "",
      invoiceDate: "",
      dueDate: "",
      status: "DRAFT",
      subtotal: 0,
      taxAmount: 0,
      totalAmount: 0,
      paidAmount: 0,
      currency: "USD",
      orderIds: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "default";
      case "PARTIALLY_PAID":
        return "secondary";
      case "UNPAID":
        return "outline";
      case "OVERDUE":
        return "destructive";
      case "SENT":
        return "secondary";
      case "DRAFT":
        return "outline";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const totalRevenue = invoices
    .filter(inv => inv.status === "PAID")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  
  const outstandingAmount = invoices
    .filter(inv => inv.status !== "PAID" && inv.status !== "CANCELLED")
    .reduce((sum, inv) => sum + inv.balanceAmount, 0);

  const overdueAmount = invoices
    .filter(inv => inv.status === "OVERDUE")
    .reduce((sum, inv) => sum + inv.balanceAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage customer invoices and payments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>
                Create a new invoice for customer billing.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="invoiceNo">Invoice No</Label>
                  <Input
                    id="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="customerName">Customer</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="subtotal">Subtotal</Label>
                  <Input
                    id="subtotal"
                    type="number"
                    value={formData.subtotal}
                    onChange={(e) => {
                      const subtotal = parseFloat(e.target.value) || 0;
                      const taxAmount = subtotal * 0.1; // 10% tax
                      setFormData({ 
                        ...formData, 
                        subtotal, 
                        taxAmount, 
                        totalAmount: subtotal + taxAmount 
                      });
                    }}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="taxAmount">Tax Amount</Label>
                  <Input
                    id="taxAmount"
                    type="number"
                    value={formData.taxAmount}
                    onChange={(e) => {
                      const taxAmount = parseFloat(e.target.value) || 0;
                      setFormData({ 
                        ...formData, 
                        taxAmount, 
                        totalAmount: formData.subtotal + taxAmount 
                      });
                    }}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="orderIds">Order IDs (comma separated)</Label>
                <Input
                  id="orderIds"
                  placeholder="ORD-001, ORD-002"
                  value={formData.orderIds}
                  onChange={(e) => setFormData({ ...formData, orderIds: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreate}>
                Create Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (MTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Paid invoices this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${outstandingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total unpaid amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>
            Manage customer invoices and track payment status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{invoice.invoiceDate}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">${invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">${invoice.paidAmount.toLocaleString()}</TableCell>
                  <TableCell className={invoice.balanceAmount > 0 ? "text-red-600" : "text-green-600"}>
                    ${invoice.balanceAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {invoice.orderIds.map((orderId, index) => (
                        <div key={index} className="text-blue-600 hover:underline cursor-pointer">
                          {orderId}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.balanceAmount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePayment(invoice.id, Math.min(1000, invoice.balanceAmount))}
                        >
                          <DollarSign className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(invoice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(invoice.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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