"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Package, Loader2, Warehouse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Inventory { id: string; quantity: number; availableQty: number; status: string; batchNo: string | null; warehouse?: { name: string }; sku?: { code: string; name: string }; location?: { code: string }; }
interface WH { id: string; name: string; }
interface SKU { id: string; code: string; name: string; }
interface WLoc { id: string; code: string; }

export default function InventoryPage() {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [warehouses, setWarehouses] = useState<WH[]>([]);
  const [skus, setSkus] = useState<SKU[]>([]);
  const [locations, setLocations] = useState<WLoc[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ warehouseId: "", locationId: "", skuId: "", batchNo: "", quantity: "", status: "AVAILABLE" });

  const fetchData = async () => {
    try {
      const [r1, r2, r3, r4] = await Promise.all([fetch("/api/inventory"), fetch("/api/warehouses"), fetch("/api/skus"), fetch("/api/warehouse-locations")]);
      if (r1.ok) setInventory(await r1.json());
      if (r2.ok) setWarehouses(await r2.json());
      if (r3.ok) setSkus(await r3.json());
      if (r4.ok) setLocations(await r4.json());
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsPageLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = inventory.filter(i => (i.sku?.code && i.sku.code.toLowerCase().includes(searchTerm.toLowerCase())) || (i.sku?.name && i.sku.name.toLowerCase().includes(searchTerm.toLowerCase())));
  const resetForm = () => setForm({ warehouseId: "", locationId: "", skuId: "", batchNo: "", quantity: "", status: "AVAILABLE" });

  const handleCreate = async () => {
    if (!form.warehouseId || !form.skuId) { toast({ title: "Error", description: "Warehouse and SKU required", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/inventory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      await fetchData(); setIsCreateOpen(false); resetForm(); toast({ title: "Inventory Added" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const totalQty = inventory.reduce((sum, i) => sum + i.quantity, 0);

  const Form = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Warehouse</Label><Select value={form.warehouseId} onValueChange={(v) => setForm({ ...form, warehouseId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Location</Label><Select value={form.locationId} onValueChange={(v) => setForm({ ...form, locationId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{locations.map(l => <SelectItem key={l.id} value={l.id}>{l.code}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">SKU</Label><Select value={form.skuId} onValueChange={(v) => setForm({ ...form, skuId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{skus.map(s => <SelectItem key={s.id} value={s.id}>{s.code} - {s.name}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Batch No</Label><Input value={form.batchNo} onChange={(e) => setForm({ ...form, batchNo: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Quantity</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="AVAILABLE">Available</SelectItem><SelectItem value="RESERVED">Reserved</SelectItem><SelectItem value="DAMAGED">Damaged</SelectItem><SelectItem value="QUARANTINE">Quarantine</SelectItem></SelectContent></Select></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Inventory</h1><p className="text-gray-600">Manage warehouse inventory</p></div><Button onClick={() => { resetForm(); setIsCreateOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Inventory</Button></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Items</CardTitle><Package className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{inventory.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Quantity</CardTitle><Package className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalQty.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Warehouses</CardTitle><Warehouse className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{warehouses.length}</div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Inventory List</CardTitle><CardDescription>All inventory items</CardDescription></CardHeader><CardContent>
        <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
        {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
          <Table><TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Name</TableHead><TableHead>Warehouse</TableHead><TableHead>Location</TableHead><TableHead>Quantity</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>
            {filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No inventory found.</TableCell></TableRow> :
              filtered.map((inv) => (<TableRow key={inv.id}><TableCell className="font-medium">{inv.sku?.code || "-"}</TableCell><TableCell>{inv.sku?.name || "-"}</TableCell><TableCell>{inv.warehouse?.name || "-"}</TableCell><TableCell>{inv.location?.code || "-"}</TableCell><TableCell>{inv.quantity}</TableCell><TableCell><Badge variant={inv.status === "AVAILABLE" ? "default" : "secondary"}>{inv.status}</Badge></TableCell></TableRow>))}
          </TableBody></Table>
        )}
      </CardContent></Card>
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}><DialogContent><DialogHeader><DialogTitle>Add Inventory</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}