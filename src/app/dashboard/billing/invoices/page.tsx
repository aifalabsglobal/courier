"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, FileText, Eye, Loader2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Invoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  customer?: { name: string };
}

interface Customer { id: string; name: string; }

export default function InvoicesPage() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [formData, setFormData] = useState({
    customerId: "", subtotal: "", taxAmount: "", totalAmount: "", status: "DRAFT"
  });

  const fetchData = async () => {
    try {
      const [invoicesRes, customersRes] = await Promise.all([fetch("/api/invoices"), fetch("/api/customers")]);
      if (invoicesRes.ok) setInvoices(await invoicesRes.json());
      if (customersRes.ok) setCustomers(await customersRes.json());
    } catch { toast({ title: "Error", description: "Failed to load data", variant: "destructive" }); }
    finally { setIsPageLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredInvoices = invoices.filter(i =>
    i.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.customer?.name && i.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => setFormData({ customerId: "", subtotal: "", taxAmount: "", totalAmount: "", status: "DRAFT" });

  const handleCreate = async () => {
    if (!formData.customerId) { toast({ title: "Error", description: "Customer required", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      await fetchData(); setIsCreateDialogOpen(false); resetForm();
      toast({ title: "Invoice Created" });
    } catch { toast({ title: "Error", description: "Failed to create invoice", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const handleEdit = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setFormData({ customerId: "", subtotal: inv.subtotal.toString(), taxAmount: inv.taxAmount.toString(), totalAmount: inv.totalAmount.toString(), status: inv.status });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedInvoice) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/invoices/${selectedInvoice.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      await fetchData(); setIsEditDialogOpen(false); setSelectedInvoice(null);
      toast({ title: "Invoice Updated" });
    } catch { toast({ title: "Error", description: "Failed to update", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInvoice) return;
    setIsLoading(true);
    try {
      await fetch(`/api/invoices/${selectedInvoice.id}`, { method: "DELETE" });
      await fetchData(); setIsDeleteDialogOpen(false); setSelectedInvoice(null);
      toast({ title: "Invoice Deleted", variant: "destructive" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const getStatusColor = (s: string) => {
    if (s === "PAID") return "default";
    if (s === "SENT" || s === "PARTIAL") return "secondary";
    if (s === "OVERDUE") return "destructive";
    return "outline";
  };

  const totalOutstanding = invoices.reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);

  const InvoiceForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Customer</Label>
        <Select value={formData.customerId} onValueChange={(v) => setFormData({ ...formData, customerId: v })}>
          <SelectTrigger className="col-span-3"><SelectValue placeholder="Select customer" /></SelectTrigger>
          <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Subtotal</Label><Input type="number" value={formData.subtotal} onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Tax</Label><Input type="number" value={formData.taxAmount} onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Total</Label><Input type="number" value={formData.totalAmount} onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Status</Label>
        <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
          <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="SENT">Sent</SelectItem><SelectItem value="PAID">Paid</SelectItem><SelectItem value="PARTIAL">Partial</SelectItem><SelectItem value="OVERDUE">Overdue</SelectItem></SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900">Invoices</h1><p className="text-gray-600">Manage customer invoices</p></div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />New Invoice</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Invoices</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{invoices.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Outstanding</CardTitle><DollarSign className="h-4 w-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-orange-600">${totalOutstanding.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Paid</CardTitle><DollarSign className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{invoices.filter(i => i.status === "PAID").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Overdue</CardTitle><FileText className="h-4 w-4 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{invoices.filter(i => i.status === "OVERDUE").length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Invoice List</CardTitle><CardDescription>All invoices</CardDescription></CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
          {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
            <Table>
              <TableHeader><TableRow><TableHead>Invoice No</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No invoices found.</TableCell></TableRow> :
                  filteredInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.invoiceNo}</TableCell>
                      <TableCell>{inv.customer?.name || "-"}</TableCell>
                      <TableCell>{new Date(inv.invoiceDate).toLocaleDateString()}</TableCell>
                      <TableCell>${inv.totalAmount.toLocaleString()}</TableCell>
                      <TableCell><Badge variant={getStatusColor(inv.status)}>{inv.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedInvoice(inv); setIsViewDialogOpen(true); }}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(inv)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedInvoice(inv); setIsDeleteDialogOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}><DialogContent><DialogHeader><DialogTitle>New Invoice</DialogTitle><DialogDescription>Create a new invoice.</DialogDescription></DialogHeader><InvoiceForm /><DialogFooter><Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}><DialogContent><DialogHeader><DialogTitle>Edit Invoice</DialogTitle></DialogHeader><InvoiceForm /><DialogFooter><Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button><Button onClick={handleUpdate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}><DialogContent><DialogHeader><DialogTitle>Invoice Details</DialogTitle><DialogDescription>{selectedInvoice?.invoiceNo}</DialogDescription></DialogHeader>{selectedInvoice && <div className="grid gap-4 py-4 grid-cols-2"><div><Label className="text-muted-foreground text-xs">Customer</Label><div className="font-medium">{selectedInvoice.customer?.name}</div></div><div><Label className="text-muted-foreground text-xs">Date</Label><div className="font-medium">{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</div></div><div><Label className="text-muted-foreground text-xs">Due Date</Label><div className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</div></div><div><Label className="text-muted-foreground text-xs">Total</Label><div className="font-medium">${selectedInvoice.totalAmount.toLocaleString()}</div></div><div><Label className="text-muted-foreground text-xs">Paid</Label><div className="font-medium">${selectedInvoice.paidAmount.toLocaleString()}</div></div><div><Label className="text-muted-foreground text-xs">Status</Label><Badge variant={getStatusColor(selectedInvoice.status)}>{selectedInvoice.status}</Badge></div></div>}<DialogFooter><Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button></DialogFooter></DialogContent></Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Invoice?</AlertDialogTitle><AlertDialogDescription>This will permanently delete <strong>{selectedInvoice?.invoiceNo}</strong>.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}