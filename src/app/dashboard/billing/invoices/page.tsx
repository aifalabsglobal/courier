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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Eye, Download, DollarSign, FileText, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
];

const invoiceStatuses = ["DRAFT", "SENT", "PAID", "PARTIALLY_PAID", "UNPAID", "OVERDUE", "CANCELLED"];

export default function InvoicesPage() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

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

  const handleCreate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

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
    setIsLoading(false);
    toast({ title: "Invoice Created", description: "New invoice generated successfully." });
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      invoiceNo: invoice.invoiceNo,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      subtotal: invoice.subtotal,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      paidAmount: invoice.paidAmount,
      currency: invoice.currency,
      orderIds: invoice.orderIds.join(", "),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedInvoice) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const balanceAmount = formData.totalAmount - formData.paidAmount;

    setInvoices(
      invoices.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
            ...inv,
            ...formData,
            balanceAmount,
            orderIds: formData.orderIds.split(",").map(id => id.trim())
          }
          : inv
      )
    );
    setIsEditDialogOpen(false);
    setSelectedInvoice(null);
    setIsLoading(false);
    toast({ title: "Invoice Updated", description: "Invoice details saved." });
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInvoice) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setInvoices(invoices.filter((inv) => inv.id !== selectedInvoice.id));
    setIsDeleteDialogOpen(false);
    setSelectedInvoice(null);
    setIsLoading(false);
    toast({ title: "Invoice Deleted", description: "Invoice removed from system.", variant: "destructive" });
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const handlePayment = async (id: string, amount: number) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
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
    setIsLoading(false);
    toast({ title: "Payment Recorded", description: `Received payment of $${amount}.` });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "default";
      case "PARTIALLY_PAID": return "secondary";
      case "UNPAID": return "outline";
      case "OVERDUE": return "destructive";
      default: return "outline";
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

  const InvoiceForm = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
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
              const taxAmount = subtotal * 0.1;
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
          <Label htmlFor="taxAmount">Tax</Label>
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
          <Label htmlFor="totalAmount">Total</Label>
          <Input
            id="totalAmount"
            type="number"
            value={formData.totalAmount}
            onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="grid items-center gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {invoiceStatuses.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid items-center gap-2">
        <Label htmlFor="orderIds">Order IDs</Label>
        <Input
          id="orderIds"
          placeholder="ORD-001, ORD-002"
          value={formData.orderIds}
          onChange={(e) => setFormData({ ...formData, orderIds: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage customer invoices and payments</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
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
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>Issued: {invoice.invoiceDate}</div>
                      <div className="text-muted-foreground">Due: {invoice.dueDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">${invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell className={invoice.balanceAmount > 0 ? "text-red-600 font-bold" : "text-green-600"}>
                    ${invoice.balanceAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleView(invoice)}>
                        <Eye className="h-4 w-4" />
                      </Button>

                      {invoice.balanceAmount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePayment(invoice.id, Math.min(1000, invoice.balanceAmount))}
                          title="Record Payment"
                        >
                          <DollarSign className="h-4 w-4 text-green-500" />
                        </Button>
                      )}

                      <Button variant="ghost" size="sm" onClick={() => handleEdit(invoice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(invoice)} className="text-red-600">
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

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>Generate a new invoice.</DialogDescription>
          </DialogHeader>
          <InvoiceForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>Update invoice details.</DialogDescription>
          </DialogHeader>
          <InvoiceForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>{selectedInvoice?.invoiceNo}</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Customer</div>
                  <div className="text-lg font-bold">{selectedInvoice.customerName}</div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusColor(selectedInvoice.status)}>{selectedInvoice.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Invoice Date</div>
                  <div>{selectedInvoice.invoiceDate}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Due Date</div>
                  <div className={selectedInvoice.status === "OVERDUE" ? "text-red-600 font-bold" : ""}>{selectedInvoice.dueDate}</div>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-md mt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>${selectedInvoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 mt-2">
                  <span>Paid</span>
                  <span>-${selectedInvoice.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-red-600 mt-2 border-t pt-2">
                  <span>Balance Due</span>
                  <span>${selectedInvoice.balanceAmount.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Associated Orders</div>
                <div className="flex gap-2 flex-wrap">
                  {selectedInvoice.orderIds.map(id => <Badge key={id} variant="outline">{id}</Badge>)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedInvoice) handleEdit(selectedInvoice); }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete invoice <strong>{selectedInvoice?.invoiceNo}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}