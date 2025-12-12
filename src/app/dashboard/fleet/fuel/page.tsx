"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Fuel, Loader2, DollarSign, Gauge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FuelEntry { id: string; date: string; quantity: number; unitPrice: number; totalCost: number; fuelType: string | null; odometer: number | null; location: string | null; receiptNo: string | null; vehicleId: string; }
interface Vehicle { id: string; registration: string; }

export default function FuelPage() {
    const { toast } = useToast();
    const [entries, setEntries] = useState<FuelEntry[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [form, setForm] = useState({ vehicleId: "", date: new Date().toISOString().split('T')[0], quantity: "", unitPrice: "", totalCost: "", fuelType: "Diesel", odometer: "", location: "", receiptNo: "" });

    const fetchData = async () => {
        try {
            const [r1, r2] = await Promise.all([fetch("/api/fuel"), fetch("/api/vehicles")]);
            if (r1.ok) setEntries(await r1.json());
            if (r2.ok) setVehicles(await r2.json());
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsPageLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const getVehicleReg = (id: string) => vehicles.find(v => v.id === id)?.registration || "-";
    const filtered = entries.filter(e => getVehicleReg(e.vehicleId).toLowerCase().includes(searchTerm.toLowerCase()));
    const resetForm = () => setForm({ vehicleId: "", date: new Date().toISOString().split('T')[0], quantity: "", unitPrice: "", totalCost: "", fuelType: "Diesel", odometer: "", location: "", receiptNo: "" });
    const totalCost = entries.reduce((sum, e) => sum + e.totalCost, 0);
    const totalLiters = entries.reduce((sum, e) => sum + e.quantity, 0);

    const handleCreate = async () => {
        if (!form.vehicleId) { toast({ title: "Error", description: "Vehicle required", variant: "destructive" }); return; }
        setIsLoading(true);
        try {
            const res = await fetch("/api/fuel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) throw new Error();
            await fetchData(); setIsCreateOpen(false); resetForm(); toast({ title: "Entry Added" });
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const Form = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Vehicle</Label><Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.registration}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Fuel Type</Label><Select value={form.fuelType} onValueChange={(v) => setForm({ ...form, fuelType: v })}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Petrol">Petrol</SelectItem><SelectItem value="CNG">CNG</SelectItem><SelectItem value="Electric">Electric</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Quantity (L)</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Unit Price</Label><Input type="number" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Total Cost</Label><Input type="number" value={form.totalCost} onChange={(e) => setForm({ ...form, totalCost: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Odometer</Label><Input type="number" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="col-span-3" /></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Fuel Management</h1><p className="text-gray-600">Track fuel consumption</p></div><Button onClick={() => { resetForm(); setIsCreateOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Entry</Button></div>
            <div className="grid gap-4 md:grid-cols-4">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Entries</CardTitle><Fuel className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{entries.length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Liters</CardTitle><Gauge className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalLiters.toLocaleString()} L</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Cost</CardTitle><DollarSign className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">${totalCost.toLocaleString()}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Avg Price/L</CardTitle><DollarSign className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">${totalLiters > 0 ? (totalCost / totalLiters).toFixed(2) : "0"}</div></CardContent></Card>
            </div>
            <Card><CardHeader><CardTitle>Fuel Entries</CardTitle><CardDescription>All fuel consumption records</CardDescription></CardHeader><CardContent>
                <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search vehicle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
                {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                    <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Vehicle</TableHead><TableHead>Fuel Type</TableHead><TableHead>Quantity</TableHead><TableHead>Cost</TableHead><TableHead>Odometer</TableHead></TableRow></TableHeader><TableBody>
                        {filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No entries found.</TableCell></TableRow> :
                            filtered.map((e) => (<TableRow key={e.id}><TableCell>{new Date(e.date).toLocaleDateString()}</TableCell><TableCell className="font-medium">{getVehicleReg(e.vehicleId)}</TableCell><TableCell>{e.fuelType || "-"}</TableCell><TableCell>{e.quantity} L</TableCell><TableCell>${e.totalCost}</TableCell><TableCell>{e.odometer || "-"}</TableCell></TableRow>))}
                    </TableBody></Table>
                )}
            </CardContent></Card>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}><DialogContent><DialogHeader><DialogTitle>Add Fuel Entry</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
        </div>
    );
}
