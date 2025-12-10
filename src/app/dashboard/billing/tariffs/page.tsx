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
import { Plus, Search, Edit, Trash2, DollarSign, Package, Truck, MapPin, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tariff {
    id: string;
    name: string;
    type: string;
    origin: string;
    destination: string;
    ratePerKg: number;
    ratePerKm: number;
    minCharge: number;
    fuelSurcharge: number;
    isActive: boolean;
    validFrom: string;
    validTo: string;
}

const mockTariffs: Tariff[] = [
    { id: "1", name: "Standard Express", type: "Express", origin: "Dallas", destination: "Houston", ratePerKg: 0.85, ratePerKm: 0.12, minCharge: 25, fuelSurcharge: 8, isActive: true, validFrom: "2024-01-01", validTo: "2024-12-31" },
    { id: "2", name: "Economy Ground", type: "Economy", origin: "Dallas", destination: "Austin", ratePerKg: 0.55, ratePerKm: 0.08, minCharge: 15, fuelSurcharge: 5, isActive: true, validFrom: "2024-01-01", validTo: "2024-12-31" },
    { id: "3", name: "Same Day Premium", type: "Same Day", origin: "Dallas", destination: "Fort Worth", ratePerKg: 1.50, ratePerKm: 0.25, minCharge: 50, fuelSurcharge: 12, isActive: true, validFrom: "2024-01-01", validTo: "2024-12-31" },
    { id: "4", name: "Freight LTL", type: "Freight", origin: "Houston", destination: "San Antonio", ratePerKg: 0.35, ratePerKm: 0.05, minCharge: 100, fuelSurcharge: 10, isActive: true, validFrom: "2024-01-01", validTo: "2024-12-31" },
    { id: "5", name: "Interstate Standard", type: "Express", origin: "Texas", destination: "California", ratePerKg: 1.20, ratePerKm: 0.18, minCharge: 75, fuelSurcharge: 15, isActive: false, validFrom: "2023-01-01", validTo: "2023-12-31" },
];

export default function TariffsPage() {
    const { toast } = useToast();
    const [tariffs, setTariffs] = useState<Tariff[]>(mockTariffs);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Selected tariff
    const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        type: "Express",
        origin: "",
        destination: "",
        ratePerKg: 0,
        ratePerKm: 0,
        minCharge: 0,
        fuelSurcharge: 0,
        isActive: true
    });

    const filteredTariffs = tariffs.filter(
        (t) =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            name: "",
            type: "Express",
            origin: "",
            destination: "",
            ratePerKg: 0,
            ratePerKm: 0,
            minCharge: 0,
            fuelSurcharge: 0,
            isActive: true
        });
    };

    const handleCreate = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const newTariff: Tariff = {
            id: Date.now().toString(),
            ...formData,
            validFrom: new Date().toISOString().split("T")[0],
            validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        };
        setTariffs([...tariffs, newTariff]);
        setIsCreateDialogOpen(false);
        resetForm();
        setIsLoading(false);
        toast({ title: "Tariff Created", description: `Tariff ${formData.name} successfully added.` });
    };

    const handleEdit = (tariff: Tariff) => {
        setSelectedTariff(tariff);
        setFormData({
            name: tariff.name,
            type: tariff.type,
            origin: tariff.origin,
            destination: tariff.destination,
            ratePerKg: tariff.ratePerKg,
            ratePerKm: tariff.ratePerKm,
            minCharge: tariff.minCharge,
            fuelSurcharge: tariff.fuelSurcharge,
            isActive: tariff.isActive
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedTariff) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setTariffs(tariffs.map(t =>
            t.id === selectedTariff.id
                ? { ...t, ...formData }
                : t
        ));
        setIsEditDialogOpen(false);
        setSelectedTariff(null);
        setIsLoading(false);
        toast({ title: "Tariff Updated", description: "Pricing structure has been modified." });
    };

    const handleView = (tariff: Tariff) => {
        setSelectedTariff(tariff);
        setIsViewDialogOpen(true);
    };

    const handleDeleteClick = (tariff: Tariff) => {
        setSelectedTariff(tariff);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedTariff) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setTariffs(tariffs.filter((t) => t.id !== selectedTariff.id));
        setIsDeleteDialogOpen(false);
        setSelectedTariff(null);
        setIsLoading(false);
        toast({ title: "Tariff Deleted", description: "Tariff has been removed.", variant: "destructive" });
    };

    const stats = {
        total: tariffs.length,
        active: tariffs.filter((t) => t.isActive).length,
        avgRate: tariffs.reduce((sum, t) => sum + t.ratePerKg, 0) / tariffs.length,
    };

    const TariffForm = () => (
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" placeholder="Standard Express" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="col-span-3 px-3 py-2 border rounded-md text-sm bg-background w-full"
                >
                    <option value="Express">Express</option>
                    <option value="Economy">Economy</option>
                    <option value="Same Day">Same Day</option>
                    <option value="Freight">Freight</option>
                </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Origin</Label>
                <Input value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} className="col-span-3" placeholder="Dallas" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Destination</Label>
                <Input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="col-span-3" placeholder="Houston" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Rate/Kg ($)</Label>
                <Input type="number" step="0.01" value={formData.ratePerKg} onChange={(e) => setFormData({ ...formData, ratePerKg: parseFloat(e.target.value) })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Rate/Km ($)</Label>
                <Input type="number" step="0.01" value={formData.ratePerKm} onChange={(e) => setFormData({ ...formData, ratePerKm: parseFloat(e.target.value) })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Min Charge ($)</Label>
                <Input type="number" value={formData.minCharge} onChange={(e) => setFormData({ ...formData, minCharge: parseFloat(e.target.value) })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Fuel Sur. (%)</Label>
                <Input type="number" value={formData.fuelSurcharge} onChange={(e) => setFormData({ ...formData, fuelSurcharge: parseFloat(e.target.value) })} className="col-span-3" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tariffs & Rates</h1>
                    <p className="text-gray-600">Manage shipping rates and pricing structures</p>
                </div>
                <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Tariff</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tariffs</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Tariffs</CardTitle>
                        <Package className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{stats.active}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Rate/Kg</CardTitle>
                        <Truck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-600">${stats.avgRate.toFixed(2)}</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rate Structure</CardTitle>
                    <CardDescription>All shipping tariffs and pricing configurations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input placeholder="Search tariffs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Rate/Kg</TableHead>
                                <TableHead>Min Charge</TableHead>
                                <TableHead>Fuel %</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTariffs.map((tariff) => (
                                <TableRow key={tariff.id}>
                                    <TableCell className="font-medium">{tariff.name}</TableCell>
                                    <TableCell><Badge variant="outline">{tariff.type}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <MapPin className="h-3 w-3 text-gray-400" />
                                            {tariff.origin} → {tariff.destination}
                                        </div>
                                    </TableCell>
                                    <TableCell>${tariff.ratePerKg.toFixed(2)}</TableCell>
                                    <TableCell>${tariff.minCharge.toFixed(2)}</TableCell>
                                    <TableCell>{tariff.fuelSurcharge}%</TableCell>
                                    <TableCell>
                                        <Badge variant={tariff.isActive ? "default" : "secondary"}>
                                            {tariff.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleView(tariff)}><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(tariff)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(tariff)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Tariff</DialogTitle>
                        <DialogDescription>Define a new shipping rate structure.</DialogDescription>
                    </DialogHeader>
                    <TariffForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Tariff</DialogTitle>
                        <DialogDescription>Modify pricing structure.</DialogDescription>
                    </DialogHeader>
                    <TariffForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tariff Details</DialogTitle>
                        <DialogDescription>Details for {selectedTariff?.name}</DialogDescription>
                    </DialogHeader>
                    {selectedTariff && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground text-xs">Route</Label>
                                    <div className="font-medium">{selectedTariff.origin} to {selectedTariff.destination}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Type</Label>
                                    <div className="font-medium">{selectedTariff.type}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Per Kg</Label>
                                    <div className="font-medium">${selectedTariff.ratePerKg}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Per Km</Label>
                                    <div className="font-medium">${selectedTariff.ratePerKm}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Min Charge</Label>
                                    <div className="font-medium">${selectedTariff.minCharge}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Fuel Surcharge</Label>
                                    <div className="font-medium">{selectedTariff.fuelSurcharge}%</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Status</Label>
                                    <Badge className="mt-1" variant={selectedTariff.isActive ? "default" : "secondary"}>
                                        {selectedTariff.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                        <Button onClick={() => { setIsViewDialogOpen(false); if (selectedTariff) handleEdit(selectedTariff); }}>
                            <Edit className="h-4 w-4 mr-2" />Edit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete tariff <strong>{selectedTariff?.name}</strong>.
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
