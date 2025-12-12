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
import { Plus, Search, Edit, Trash2, Wrench, Loader2, DollarSign, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Maintenance { id: string; type: string; description: string | null; cost: number; status: string; performedAt: string | null; nextDueAt: string | null; vehicle?: { registration: string }; }
interface Vehicle { id: string; registration: string; }

export default function MaintenancePage() {
  const { toast } = useToast();
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Maintenance | null>(null);
  const [form, setForm] = useState({ vehicleId: "", type: "PREVENTIVE", description: "", cost: "", status: "SCHEDULED", performedAt: "", nextDueAt: "" });

  const fetchData = async () => {
    try {
      const [r1, r2] = await Promise.all([fetch("/api/maintenance"), fetch("/api/vehicles")]);
      if (r1.ok) setMaintenance(await r1.json());
      if (r2.ok) setVehicles(await r2.json());
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsPageLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = maintenance.filter(m => (m.vehicle?.registration && m.vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase())) || m.type.toLowerCase().includes(searchTerm.toLowerCase()));
  const resetForm = () => setForm({ vehicleId: "", type: "PREVENTIVE", description: "", cost: "", status: "SCHEDULED", performedAt: "", nextDueAt: "" });
  const totalCost = maintenance.reduce((sum, m) => sum + m.cost, 0);

  const handleCreate = async () => {
    if (!form.vehicleId) { toast({ title: "Error", description: "Vehicle required", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/maintenance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      await fetchData(); setIsCreateOpen(false); resetForm(); toast({ title: "Created" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const handleEdit = (m: Maintenance) => { setSelected(m); setForm({ vehicleId: "", type: m.type, description: m.description || "", cost: m.cost.toString(), status: m.status, performedAt: m.performedAt ? new Date(m.performedAt).toISOString().split('T')[0] : "", nextDueAt: m.nextDueAt ? new Date(m.nextDueAt).toISOString().split('T')[0] : "" }); setIsEditOpen(true); };

  const handleUpdate = async () => {
    if (!selected) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/maintenance/${selected.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      await fetchData(); setIsEditOpen(false); setSelected(null); toast({ title: "Updated" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setIsLoading(true);
    try { await fetch(`/api/maintenance/${selected.id}`, { method: "DELETE" }); await fetchData(); setIsDeleteOpen(false); setSelected(null); toast({ title: "Deleted", variant: "destructive" }); }
    catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const getStatusColor = (s: string) => s === "COMPLETED" ? "default" : s === "IN_PROGRESS" ? "secondary" : "outline";

  const Form = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Vehicle</Label><Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.registration}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Type</Label><Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PREVENTIVE">Preventive</SelectItem><SelectItem value="CORRECTIVE">Corrective</SelectItem><SelectItem value="EMERGENCY">Emergency</SelectItem></SelectContent></Select></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Cost</Label><Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="SCHEDULED">Scheduled</SelectItem><SelectItem value="IN_PROGRESS">In Progress</SelectItem><SelectItem value="COMPLETED">Completed</SelectItem><SelectItem value="CANCELLED">Cancelled</SelectItem></SelectContent></Select></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Performed</Label><Input type="date" value={form.performedAt} onChange={(e) => setForm({ ...form, performedAt: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Next Due</Label><Input type="date" value={form.nextDueAt} onChange={(e) => setForm({ ...form, nextDueAt: e.target.value })} className="col-span-3" /></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Maintenance</h1><p className="text-gray-600">Vehicle maintenance records</p></div><Button onClick={() => { resetForm(); setIsCreateOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add</Button></div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total</CardTitle><Wrench className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{maintenance.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Scheduled</CardTitle><Calendar className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{maintenance.filter(m => m.status === "SCHEDULED").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completed</CardTitle><Wrench className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{maintenance.filter(m => m.status === "COMPLETED").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Cost</CardTitle><DollarSign className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">${totalCost.toLocaleString()}</div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Maintenance Records</CardTitle><CardDescription>All maintenance history</CardDescription></CardHeader><CardContent>
        <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
        {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
          <Table><TableHeader><TableRow><TableHead>Vehicle</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead>Cost</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>
            {filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No records found.</TableCell></TableRow> :
              filtered.map((m) => (<TableRow key={m.id}><TableCell className="font-medium">{m.vehicle?.registration || "-"}</TableCell><TableCell><Badge variant="outline">{m.type}</Badge></TableCell><TableCell>{m.description || "-"}</TableCell><TableCell>${m.cost}</TableCell><TableCell><Badge variant={getStatusColor(m.status)}>{m.status}</Badge></TableCell><TableCell><div className="flex items-center space-x-1"><Button variant="ghost" size="sm" onClick={() => handleEdit(m)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => { setSelected(m); setIsDeleteOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}
          </TableBody></Table>
        )}
      </CardContent></Card>
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}><DialogContent><DialogHeader><DialogTitle>Add Maintenance</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}><DialogContent><DialogHeader><DialogTitle>Edit Maintenance</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleUpdate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button></DialogFooter></DialogContent></Dialog>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle><AlertDialogDescription>Delete this maintenance record?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}