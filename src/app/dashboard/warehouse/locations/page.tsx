"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, MapPin, Loader2, Warehouse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WLoc { id: string; code: string | null; zone: string | null; aisle: string | null; rack: string | null; level: string | null; locationType: string | null; capacityWeight: number | null; isActive: boolean; warehouse?: { name: string }; }
interface WH { id: string; name: string; }

export default function WarehouseLocationsPage() {
    const { toast } = useToast();
    const [locations, setLocations] = useState<WLoc[]>([]);
    const [warehouses, setWarehouses] = useState<WH[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<WLoc | null>(null);
    const [form, setForm] = useState({ warehouseId: "", code: "", zone: "", aisle: "", rack: "", level: "", locationType: "storage", capacityWeight: "" });

    const fetchData = async () => {
        try {
            const [r1, r2] = await Promise.all([fetch("/api/warehouse-locations"), fetch("/api/warehouses")]);
            if (r1.ok) setLocations(await r1.json());
            if (r2.ok) setWarehouses(await r2.json());
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsPageLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = locations.filter(l => (l.code && l.code.toLowerCase().includes(searchTerm.toLowerCase())));
    const resetForm = () => setForm({ warehouseId: "", code: "", zone: "", aisle: "", rack: "", level: "", locationType: "storage", capacityWeight: "" });

    const handleCreate = async () => {
        if (!form.warehouseId) { toast({ title: "Error", description: "Warehouse required", variant: "destructive" }); return; }
        setIsLoading(true);
        try {
            const res = await fetch("/api/warehouse-locations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) throw new Error();
            await fetchData(); setIsCreateOpen(false); resetForm(); toast({ title: "Created" });
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleEdit = (loc: WLoc) => { setSelected(loc); setForm({ warehouseId: "", code: loc.code || "", zone: loc.zone || "", aisle: loc.aisle || "", rack: loc.rack || "", level: loc.level || "", locationType: loc.locationType || "storage", capacityWeight: loc.capacityWeight?.toString() || "" }); setIsEditOpen(true); };

    const handleUpdate = async () => {
        if (!selected) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/warehouse-locations/${selected.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) throw new Error();
            await fetchData(); setIsEditOpen(false); setSelected(null); toast({ title: "Updated" });
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setIsLoading(true);
        try { await fetch(`/api/warehouse-locations/${selected.id}`, { method: "DELETE" }); await fetchData(); setIsDeleteOpen(false); setSelected(null); toast({ title: "Deleted", variant: "destructive" }); }
        catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const Form = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Warehouse</Label><Select value={form.warehouseId} onValueChange={(v) => setForm({ ...form, warehouseId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Zone</Label><Input value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Aisle</Label><Input value={form.aisle} onChange={(e) => setForm({ ...form, aisle: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Rack</Label><Input value={form.rack} onChange={(e) => setForm({ ...form, rack: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Level</Label><Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Type</Label><Select value={form.locationType} onValueChange={(v) => setForm({ ...form, locationType: v })}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="storage">Storage</SelectItem><SelectItem value="picking">Picking</SelectItem><SelectItem value="receiving">Receiving</SelectItem><SelectItem value="shipping">Shipping</SelectItem></SelectContent></Select></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Warehouse Locations</h1><p className="text-gray-600">Manage storage locations</p></div><Button onClick={() => { resetForm(); setIsCreateOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add</Button></div>
            <div className="grid gap-4 md:grid-cols-3">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total</CardTitle><MapPin className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{locations.length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Warehouses</CardTitle><Warehouse className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{warehouses.length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active</CardTitle><MapPin className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{locations.filter(l => l.isActive).length}</div></CardContent></Card>
            </div>
            <Card><CardHeader><CardTitle>Locations</CardTitle><CardDescription>All warehouse locations</CardDescription></CardHeader><CardContent>
                <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
                {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                    <Table><TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Warehouse</TableHead><TableHead>Zone/Aisle</TableHead><TableHead>Type</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>
                        {filtered.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center h-24">No locations found.</TableCell></TableRow> :
                            filtered.map((loc) => (<TableRow key={loc.id}><TableCell className="font-medium">{loc.code || "-"}</TableCell><TableCell>{loc.warehouse?.name || "-"}</TableCell><TableCell>{[loc.zone, loc.aisle].filter(Boolean).join("/") || "-"}</TableCell><TableCell><Badge variant="outline">{loc.locationType || "-"}</Badge></TableCell><TableCell><div className="flex items-center space-x-1"><Button variant="ghost" size="sm" onClick={() => handleEdit(loc)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => { setSelected(loc); setIsDeleteOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}
                    </TableBody></Table>
                )}
            </CardContent></Card>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}><DialogContent><DialogHeader><DialogTitle>Add Location</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}><DialogContent><DialogHeader><DialogTitle>Edit Location</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleUpdate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button></DialogFooter></DialogContent></Dialog>
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle><AlertDialogDescription>Delete {selected?.code}?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </div>
    );
}
