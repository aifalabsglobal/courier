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
import { Plus, Search, Edit, Trash2, Package, Eye, Loader2, MapPin, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Order {
  id: string;
  orderNo: string;
  status: string;
  priority: string;
  shipperCity: string | null;
  consigneeCity: string | null;
  totalWeight: number;
  packageCount: number;
  customer?: { name: string };
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false });

  const [formData, setFormData] = useState({
    customerId: "", orderType: "FTL", priority: "NORMAL", status: "DRAFT",
    shipperName: "", shipperCity: "", consigneeName: "", consigneeCity: "",
    totalWeight: "", packageCount: "", description: ""
  });

  const fetchOrders = async (page = 1, search = "") => {
    try {
      setIsPageLoading(true);
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (search) params.set('search', search);

      const [ordersRes, customersRes] = await Promise.all([
        fetch(`/api/orders?${params}`),
        fetch("/api/customers?all=true")
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        // Handle both paginated and non-paginated responses
        if (data.data) {
          setOrders(data.data);
          setPagination(data.pagination);
        } else {
          setOrders(Array.isArray(data) ? data : []);
        }
      }
      if (customersRes.ok) {
        const custData = await customersRes.json();
        setCustomers(Array.isArray(custData) ? custData : custData.data || []);
      }
    } catch { toast({ title: "Error", description: "Failed to load orders", variant: "destructive" }); }
    finally { setIsPageLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) fetchOrders(1, searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage, searchTerm);
  };

  const resetForm = () => setFormData({ customerId: "", orderType: "FTL", priority: "NORMAL", status: "DRAFT", shipperName: "", shipperCity: "", consigneeName: "", consigneeCity: "", totalWeight: "", packageCount: "", description: "" });

  const handleCreate = async () => {
    if (!formData.customerId) { toast({ title: "Error", description: "Customer required", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      await fetchOrders(); setIsCreateDialogOpen(false); resetForm();
      toast({ title: "Order Created" });
    } catch { toast({ title: "Error", description: "Failed to create order", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const handleEdit = (o: Order) => {
    setSelectedOrder(o);
    setFormData({ customerId: "", orderType: "FTL", priority: o.priority, status: o.status, shipperName: "", shipperCity: o.shipperCity || "", consigneeName: "", consigneeCity: o.consigneeCity || "", totalWeight: o.totalWeight.toString(), packageCount: o.packageCount.toString(), description: "" });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      await fetchOrders(); setIsEditDialogOpen(false); setSelectedOrder(null);
      toast({ title: "Order Updated" });
    } catch { toast({ title: "Error", description: "Failed to update", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    setIsLoading(true);
    try {
      await fetch(`/api/orders/${selectedOrder.id}`, { method: "DELETE" });
      await fetchOrders(); setIsDeleteDialogOpen(false); setSelectedOrder(null);
      toast({ title: "Order Deleted", variant: "destructive" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const getStatusColor = (s: string) => {
    if (s === "DELIVERED" || s === "CLOSED") return "default";
    if (s === "IN_TRANSIT" || s === "DISPATCHED") return "secondary";
    if (s === "DRAFT") return "outline";
    return "outline";
  };

  const OrderForm = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Customer</Label>
        <Select value={formData.customerId} onValueChange={(v) => setFormData({ ...formData, customerId: v })}>
          <SelectTrigger className="col-span-3"><SelectValue placeholder="Select customer" /></SelectTrigger>
          <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Type</Label>
        <Select value={formData.orderType} onValueChange={(v) => setFormData({ ...formData, orderType: v })}>
          <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="FTL">Full Truck Load</SelectItem><SelectItem value="LTL">Less Than Truckload</SelectItem><SelectItem value="PARCEL">Parcel</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Priority</Label>
        <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
          <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="LOW">Low</SelectItem><SelectItem value="NORMAL">Normal</SelectItem><SelectItem value="HIGH">High</SelectItem><SelectItem value="URGENT">Urgent</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Origin City</Label><Input value={formData.shipperCity} onChange={(e) => setFormData({ ...formData, shipperCity: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Dest City</Label><Input value={formData.consigneeCity} onChange={(e) => setFormData({ ...formData, consigneeCity: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Weight (kg)</Label><Input type="number" value={formData.totalWeight} onChange={(e) => setFormData({ ...formData, totalWeight: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Packages</Label><Input type="number" value={formData.packageCount} onChange={(e) => setFormData({ ...formData, packageCount: e.target.value })} className="col-span-3" /></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900">Orders</h1><p className="text-gray-600">Manage customer orders</p></div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />New Order</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Orders</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{orders.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Draft</CardTitle><Package className="h-4 w-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{orders.filter(o => o.status === "DRAFT").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">In Transit</CardTitle><Package className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === "IN_TRANSIT").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Delivered</CardTitle><Package className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === "DELIVERED").length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Order List</CardTitle><CardDescription>All orders {pagination.total > 0 && `(${pagination.total} total)`}</CardDescription></CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
          {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
            <>
              <Table>
                <TableHeader><TableRow><TableHead>Order No</TableHead><TableHead>Customer</TableHead><TableHead>Route</TableHead><TableHead>Weight</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {orders.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No orders found.</TableCell></TableRow> :
                    orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.orderNo}</TableCell>
                        <TableCell>{o.customer?.name || "-"}</TableCell>
                        <TableCell><div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{o.shipperCity || "-"} → {o.consigneeCity || "-"}</div></TableCell>
                        <TableCell>{o.totalWeight} kg</TableCell>
                        <TableCell><Badge variant={getStatusColor(o.status)}>{o.status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedOrder(o); setIsViewDialogOpen(true); }}><Eye className="h-4 w-4" /></Button>
                            <Link href={`/dashboard/orders/waybill/${o.id}`}><Button variant="ghost" size="sm" title="Print Waybill"><Printer className="h-4 w-4" /></Button></Link>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(o)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedOrder(o); setIsDeleteDialogOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page - 1)} disabled={!pagination.hasPrev}>
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page + 1)} disabled={!pagination.hasNext}>
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>New Order</DialogTitle><DialogDescription>Create a new order.</DialogDescription></DialogHeader><OrderForm /><DialogFooter><Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Order</DialogTitle></DialogHeader><OrderForm /><DialogFooter><Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button><Button onClick={handleUpdate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}><DialogContent><DialogHeader><DialogTitle>Order Details</DialogTitle><DialogDescription>{selectedOrder?.orderNo}</DialogDescription></DialogHeader>{selectedOrder && <div className="grid gap-4 py-4 grid-cols-2"><div><Label className="text-muted-foreground text-xs">Customer</Label><div className="font-medium">{selectedOrder.customer?.name}</div></div><div><Label className="text-muted-foreground text-xs">Status</Label><Badge variant={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge></div><div><Label className="text-muted-foreground text-xs">Route</Label><div className="font-medium">{selectedOrder.shipperCity} → {selectedOrder.consigneeCity}</div></div><div><Label className="text-muted-foreground text-xs">Weight</Label><div className="font-medium">{selectedOrder.totalWeight} kg</div></div><div><Label className="text-muted-foreground text-xs">Packages</Label><div className="font-medium">{selectedOrder.packageCount}</div></div></div>}<DialogFooter><Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button></DialogFooter></DialogContent></Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Order?</AlertDialogTitle><AlertDialogDescription>This will permanently delete <strong>{selectedOrder?.orderNo}</strong>.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}