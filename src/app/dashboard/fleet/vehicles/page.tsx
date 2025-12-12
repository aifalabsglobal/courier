"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Truck, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
    id: string;
    registration: string;
    make: string | null;
    model: string | null;
    year: number | null;
    capacityWeight: number | null;
    isActive: boolean;
    vehicleType?: { name: string };
}

export default function FleetVehiclesPage() {
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const [formData, setFormData] = useState({
        registration: "", make: "", model: "", year: new Date().getFullYear(),
        type: "Heavy Truck", capacityWeight: "", status: "Active"
    });

    const fetchVehicles = async () => {
        try {
            const res = await fetch("/api/vehicles");
            if (!res.ok) throw new Error("Failed");
            setVehicles(await res.json());
        } catch { toast({ title: "Error", description: "Failed to load vehicles", variant: "destructive" }); }
        finally { setIsPageLoading(false); }
    };

    useEffect(() => { fetchVehicles(); }, []);

    const filteredVehicles = vehicles.filter(v =>
        v.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.make && v.make.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const resetForm = () => setFormData({ registration: "", make: "", model: "", year: new Date().getFullYear(), type: "Heavy Truck", capacityWeight: "", status: "Active" });

    const handleCreate = async () => {
        if (!formData.registration) { toast({ title: "Error", description: "Registration required", variant: "destructive" }); return; }
        setIsLoading(true);
        try {
            const res = await fetch("/api/vehicles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            if (!res.ok) throw new Error();
            await fetchVehicles(); setIsCreateDialogOpen(false); resetForm();
            toast({ title: "Vehicle Added" });
        } catch { toast({ title: "Error", description: "Failed to create", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleEdit = (v: Vehicle) => {
        setSelectedVehicle(v);
        setFormData({ registration: v.registration, make: v.make || "", model: v.model || "", year: v.year || new Date().getFullYear(), type: v.vehicleType?.name || "Heavy Truck", capacityWeight: v.capacityWeight?.toString() || "", status: v.isActive ? "Active" : "Inactive" });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedVehicle) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/vehicles/${selectedVehicle.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            if (!res.ok) throw new Error();
            await fetchVehicles(); setIsEditDialogOpen(false); setSelectedVehicle(null);
            toast({ title: "Vehicle Updated" });
        } catch { toast({ title: "Error", description: "Failed to update", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedVehicle) return;
        setIsLoading(true);
        try {
            await fetch(`/api/vehicles/${selectedVehicle.id}`, { method: "DELETE" });
            await fetchVehicles(); setIsDeleteDialogOpen(false); setSelectedVehicle(null);
            toast({ title: "Vehicle Deleted", variant: "destructive" });
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const VehicleForm = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Registration</Label><Input value={formData.registration} onChange={(e) => setFormData({ ...formData, registration: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Make</Label><Input value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Model</Label><Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Year</Label><Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Weight (kg)</Label><Input type="number" value={formData.capacityWeight} onChange={(e) => setFormData({ ...formData, capacityWeight: e.target.value })} className="col-span-3" /></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-3xl font-bold text-gray-900">Fleet Vehicles</h1><p className="text-gray-600">Manage your vehicle fleet</p></div>
                <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Vehicle</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Vehicles</CardTitle><Truck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{vehicles.length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active</CardTitle><Truck className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{vehicles.filter(v => v.isActive).length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Inactive</CardTitle><Truck className="h-4 w-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-gray-600">{vehicles.filter(v => !v.isActive).length}</div></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Vehicle List</CardTitle><CardDescription>All fleet vehicles</CardDescription></CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
                    {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
                        <Table>
                            <TableHeader><TableRow><TableHead>Registration</TableHead><TableHead>Make/Model</TableHead><TableHead>Type</TableHead><TableHead>Capacity</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {filteredVehicles.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No vehicles found.</TableCell></TableRow> :
                                    filteredVehicles.map((v) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-medium">{v.registration}</TableCell>
                                            <TableCell>{v.make} {v.model}</TableCell>
                                            <TableCell>{v.vehicleType?.name || "-"}</TableCell>
                                            <TableCell>{v.capacityWeight ? `${v.capacityWeight} kg` : "-"}</TableCell>
                                            <TableCell><Badge variant={v.isActive ? "default" : "secondary"}>{v.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedVehicle(v); setIsViewDialogOpen(true); }}><Eye className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(v)}><Edit className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedVehicle(v); setIsDeleteDialogOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}><DialogContent><DialogHeader><DialogTitle>Add Vehicle</DialogTitle><DialogDescription>Create a new vehicle.</DialogDescription></DialogHeader><VehicleForm /><DialogFooter><Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}><DialogContent><DialogHeader><DialogTitle>Edit Vehicle</DialogTitle><DialogDescription>Update vehicle details.</DialogDescription></DialogHeader><VehicleForm /><DialogFooter><Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button><Button onClick={handleUpdate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button></DialogFooter></DialogContent></Dialog>
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}><DialogContent><DialogHeader><DialogTitle>Vehicle Details</DialogTitle></DialogHeader>{selectedVehicle && <div className="grid gap-4 py-4"><div className="grid grid-cols-2 gap-4"><div><Label className="text-muted-foreground text-xs">Registration</Label><div className="font-medium">{selectedVehicle.registration}</div></div><div><Label className="text-muted-foreground text-xs">Make/Model</Label><div className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</div></div><div><Label className="text-muted-foreground text-xs">Year</Label><div className="font-medium">{selectedVehicle.year || "-"}</div></div><div><Label className="text-muted-foreground text-xs">Capacity</Label><div className="font-medium">{selectedVehicle.capacityWeight ? `${selectedVehicle.capacityWeight} kg` : "-"}</div></div><div><Label className="text-muted-foreground text-xs">Status</Label><Badge className="mt-1" variant={selectedVehicle.isActive ? "default" : "secondary"}>{selectedVehicle.isActive ? "Active" : "Inactive"}</Badge></div></div></div>}<DialogFooter><Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button><Button onClick={() => { setIsViewDialogOpen(false); if (selectedVehicle) handleEdit(selectedVehicle); }}><Edit className="h-4 w-4 mr-2" />Edit</Button></DialogFooter></DialogContent></Dialog>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Vehicle?</AlertDialogTitle><AlertDialogDescription>This will permanently delete <strong>{selectedVehicle?.registration}</strong>.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </div>
    );
}
