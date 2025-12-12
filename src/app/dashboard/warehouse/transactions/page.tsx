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
import { Plus, Search, ArrowDownRight, ArrowUpRight, RefreshCw, AlertCircle, Package, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction { id: string; transactionType: string; quantity: number; referenceNo: string | null; reason: string | null; createdAt: string; warehouse?: { name: string }; sku?: { code: string; name: string }; location?: { code: string }; }
interface WH { id: string; name: string; }
interface SKU { id: string; code: string; name: string; }
interface WLoc { id: string; code: string; }

export default function TransactionsPage() {
    const { toast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [warehouses, setWarehouses] = useState<WH[]>([]);
    const [skus, setSkus] = useState<SKU[]>([]);
    const [locations, setLocations] = useState<WLoc[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [form, setForm] = useState({ warehouseId: "", locationId: "", skuId: "", transactionType: "INBOUND", quantity: "", referenceNo: "", reason: "" });

    const fetchData = async () => {
        try {
            const [r1, r2, r3, r4] = await Promise.all([fetch("/api/inventory-transactions"), fetch("/api/warehouses"), fetch("/api/skus"), fetch("/api/warehouse-locations")]);
            if (r1.ok) setTransactions(await r1.json());
            if (r2.ok) setWarehouses(await r2.json());
            if (r3.ok) setSkus(await r3.json());
            if (r4.ok) setLocations(await r4.json());
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsPageLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = transactions.filter(t => (t.referenceNo && t.referenceNo.toLowerCase().includes(searchTerm.toLowerCase())) || (t.sku?.code && t.sku.code.toLowerCase().includes(searchTerm.toLowerCase())));
    const resetForm = () => setForm({ warehouseId: "", locationId: "", skuId: "", transactionType: "INBOUND", quantity: "", referenceNo: "", reason: "" });

    const handleCreate = async () => {
        if (!form.warehouseId || !form.skuId || !form.transactionType) { toast({ title: "Error", description: "Required fields missing", variant: "destructive" }); return; }
        setIsLoading(true);
        try {
            const res = await fetch("/api/inventory-transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) throw new Error();
            await fetchData(); setIsCreateOpen(false); resetForm(); toast({ title: "Transaction Created" });
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const getTypeIcon = (type: string) => {
        if (type === "INBOUND") return <ArrowDownRight className="h-4 w-4 text-green-500" />;
        if (type === "OUTBOUND") return <ArrowUpRight className="h-4 w-4 text-red-500" />;
        if (type === "TRANSFER") return <RefreshCw className="h-4 w-4 text-blue-500" />;
        if (type === "ADJUSTMENT") return <AlertCircle className="h-4 w-4 text-orange-500" />;
        return <Package className="h-4 w-4" />;
    };

    const Form = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Warehouse</Label><Select value={form.warehouseId} onValueChange={(v) => setForm({ ...form, warehouseId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Location</Label><Select value={form.locationId} onValueChange={(v) => setForm({ ...form, locationId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{locations.map(l => <SelectItem key={l.id} value={l.id}>{l.code}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">SKU</Label><Select value={form.skuId} onValueChange={(v) => setForm({ ...form, skuId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{skus.map(s => <SelectItem key={s.id} value={s.id}>{s.code} - {s.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Type</Label><Select value={form.transactionType} onValueChange={(v) => setForm({ ...form, transactionType: v })}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="INBOUND">Inbound</SelectItem><SelectItem value="OUTBOUND">Outbound</SelectItem><SelectItem value="TRANSFER">Transfer</SelectItem><SelectItem value="ADJUSTMENT">Adjustment</SelectItem><SelectItem value="CYCLE_COUNT">Cycle Count</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Quantity</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Reference</Label><Input value={form.referenceNo} onChange={(e) => setForm({ ...form, referenceNo: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Reason</Label><Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="col-span-3" /></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Transactions</h1><p className="text-gray-600">Inventory movement history</p></div><Button onClick={() => { resetForm(); setIsCreateOpen(true); }}><Plus className="h-4 w-4 mr-2" />New Transaction</Button></div>
            <div className="grid gap-4 md:grid-cols-4">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total</CardTitle><Package className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{transactions.length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Inbound</CardTitle><ArrowDownRight className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{transactions.filter(t => t.transactionType === "INBOUND").length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Outbound</CardTitle><ArrowUpRight className="h-4 w-4 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{transactions.filter(t => t.transactionType === "OUTBOUND").length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Transfers</CardTitle><RefreshCw className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{transactions.filter(t => t.transactionType === "TRANSFER").length}</div></CardContent></Card>
            </div>
            <Card><CardHeader><CardTitle>Transaction History</CardTitle><CardDescription>All inventory movements</CardDescription></CardHeader><CardContent>
                <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
                {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                    <Table><TableHeader><TableRow><TableHead>Type</TableHead><TableHead>SKU</TableHead><TableHead>Warehouse</TableHead><TableHead>Qty</TableHead><TableHead>Reference</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>
                        {filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No transactions found.</TableCell></TableRow> :
                            filtered.map((t) => (<TableRow key={t.id}><TableCell><div className="flex items-center gap-2">{getTypeIcon(t.transactionType)}<Badge variant="outline">{t.transactionType}</Badge></div></TableCell><TableCell>{t.sku?.code || "-"}</TableCell><TableCell>{t.warehouse?.name || "-"}</TableCell><TableCell className={t.quantity >= 0 ? "text-green-600" : "text-red-600"}>{t.quantity >= 0 ? "+" : ""}{t.quantity}</TableCell><TableCell>{t.referenceNo || "-"}</TableCell><TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell></TableRow>))}
                    </TableBody></Table>
                )}
            </CardContent></Card>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}><DialogContent><DialogHeader><DialogTitle>New Transaction</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
        </div>
    );
}
