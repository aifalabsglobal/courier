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
import { Plus, Search, Edit, Trash2, DollarSign, Loader2, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tariff { id: string; name: string; description: string | null; type: string; validFrom: string; validTo: string | null; isActive: boolean; }

export default function TariffsPage() {
    const { toast } = useToast();
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<Tariff | null>(null);
    const [form, setForm] = useState({ name: "", description: "", type: "weight_based", validFrom: new Date().toISOString().split('T')[0], validTo: "", isActive: true });

    const fetchData = async () => {
        try {
            const res = await fetch("/api/tariffs");
            if (res.ok) setTariffs(await res.json());
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsPageLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = tariffs.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const resetForm = () => setForm({ name: "", description: "", type: "weight_based", validFrom: new Date().toISOString().split('T')[0], validTo: "", isActive: true });

    const handleCreate = async () => {
        if (!form.name || !form.type) { toast({ title: "Error", description: "Name and type required", variant: "destructive" }); return; }
        setIsLoading(true);
        try {
            const res = await fetch("/api/tariffs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) throw new Error();
            await fetchData(); setIsCreateOpen(false); resetForm(); toast({ title: "Created" });
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleEdit = (t: Tariff) => { setSelected(t); setForm({ name: t.name, description: t.description || "", type: t.type, validFrom: new Date(t.validFrom).toISOString().split('T')[0], validTo: t.validTo ? new Date(t.validTo).toISOString().split('T')[0] : "", isActive: t.isActive }); setIsEditOpen(true); };

    const handleUpdate = async () => {
        if (!selected) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/tariffs/${selected.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) throw new Error();
            await fetchData(); setIsEditOpen(false); setSelected(null); toast({ title: "Updated" });
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setIsLoading(true);
        try { await fetch(`/api/tariffs/${selected.id}`, { method: "DELETE" }); await fetchData(); setIsDeleteOpen(false); setSelected(null); toast({ title: "Deleted", variant: "destructive" }); }
        catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const Form = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Type</Label><Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="weight_based">Weight Based</SelectItem><SelectItem value="zone_based">Zone Based</SelectItem><SelectItem value="lane_based">Lane Based</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Valid From</Label><Input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Valid To</Label><Input type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} className="col-span-3" /></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Tariffs</h1><p className="text-gray-600">Manage pricing tariffs</p></div><Button onClick={() => { resetForm(); setIsCreateOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Tariff</Button></div>
            <div className="grid gap-4 md:grid-cols-3">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Tariffs</CardTitle><FileText className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{tariffs.length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active</CardTitle><DollarSign className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{tariffs.filter(t => t.isActive).length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Expired</CardTitle><Calendar className="h-4 w-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-gray-600">{tariffs.filter(t => t.validTo && new Date(t.validTo) < new Date()).length}</div></CardContent></Card>
            </div>
            <Card><CardHeader><CardTitle>Tariff List</CardTitle><CardDescription>All pricing tariffs</CardDescription></CardHeader><CardContent>
                <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
                {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                    <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Valid From</TableHead><TableHead>Valid To</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>
                        {filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No tariffs found.</TableCell></TableRow> :
                            filtered.map((t) => (<TableRow key={t.id}><TableCell className="font-medium">{t.name}</TableCell><TableCell><Badge variant="outline">{t.type.replace('_', ' ')}</Badge></TableCell><TableCell>{new Date(t.validFrom).toLocaleDateString()}</TableCell><TableCell>{t.validTo ? new Date(t.validTo).toLocaleDateString() : "-"}</TableCell><TableCell><Badge variant={t.isActive ? "default" : "secondary"}>{t.isActive ? "Active" : "Inactive"}</Badge></TableCell><TableCell><div className="flex items-center space-x-1"><Button variant="ghost" size="sm" onClick={() => handleEdit(t)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => { setSelected(t); setIsDeleteOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}
                    </TableBody></Table>
                )}
            </CardContent></Card>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}><DialogContent><DialogHeader><DialogTitle>Add Tariff</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}><DialogContent><DialogHeader><DialogTitle>Edit Tariff</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleUpdate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button></DialogFooter></DialogContent></Dialog>
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle><AlertDialogDescription>Delete tariff {selected?.name}?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </div>
    );
}
