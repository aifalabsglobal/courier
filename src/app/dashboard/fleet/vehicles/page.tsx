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
import { Plus, Search, Edit, Trash2, Truck, Calendar, AlertTriangle, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
    id: string;
    registration: string;
    make: string;
    model: string;
    year: number;
    type: string;
    capacityWeight: number;
    status: string;
    lastService: string;
    nextService: string;
    isActive: boolean;
}

const mockVehicles: Vehicle[] = [
    { id: "1", registration: "TX-1234-AB", make: "Volvo", model: "FH16", year: 2022, type: "Heavy Truck", capacityWeight: 25000, status: "available", lastService: "2024-11-15", nextService: "2025-02-15", isActive: true },
    { id: "2", registration: "TX-5678-CD", make: "Mercedes", model: "Actros", year: 2023, type: "Heavy Truck", capacityWeight: 20000, status: "in_transit", lastService: "2024-10-20", nextService: "2025-01-20", isActive: true },
    { id: "3", registration: "TX-9012-EF", make: "Ford", model: "Transit", year: 2021, type: "Van", capacityWeight: 2000, status: "available", lastService: "2024-12-01", nextService: "2025-03-01", isActive: true },
    { id: "4", registration: "TX-3456-GH", make: "Isuzu", model: "NPR", year: 2020, type: "Medium Truck", capacityWeight: 8000, status: "maintenance", lastService: "2024-09-10", nextService: "2024-12-10", isActive: false },
    { id: "5", registration: "TX-7890-IJ", make: "Scania", model: "R500", year: 2023, type: "Heavy Truck", capacityWeight: 30000, status: "available", lastService: "2024-11-25", nextService: "2025-02-25", isActive: true },
];

export default function FleetVehiclesPage() {
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Create dialog
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // Edit dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    // View dialog
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);

    // Delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

    const [formData, setFormData] = useState({
        registration: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        type: "Heavy Truck",
        capacityWeight: 0,
    });

    const filteredVehicles = vehicles.filter(
        (v) =>
            v.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const newVehicle: Vehicle = {
            id: Date.now().toString(),
            ...formData,
            status: "available",
            lastService: new Date().toISOString().split("T")[0],
            nextService: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            isActive: true,
        };
        setVehicles([...vehicles, newVehicle]);
        setIsCreateDialogOpen(false);
        setFormData({ registration: "", make: "", model: "", year: new Date().getFullYear(), type: "Heavy Truck", capacityWeight: 0 });
        setIsLoading(false);
        toast({ title: "Vehicle Added", description: `${formData.make} ${formData.model} has been added to the fleet.` });
    };

    const handleEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setFormData({
            registration: vehicle.registration,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            type: vehicle.type,
            capacityWeight: vehicle.capacityWeight,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingVehicle) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setVehicles(vehicles.map(v =>
            v.id === editingVehicle.id
                ? { ...v, ...formData }
                : v
        ));
        setIsEditDialogOpen(false);
        setEditingVehicle(null);
        setFormData({ registration: "", make: "", model: "", year: new Date().getFullYear(), type: "Heavy Truck", capacityWeight: 0 });
        setIsLoading(false);
        toast({ title: "Vehicle Updated", description: `${formData.make} ${formData.model} has been updated.` });
    };

    const handleView = (vehicle: Vehicle) => {
        setViewingVehicle(vehicle);
        setIsViewDialogOpen(true);
    };

    const handleDeleteClick = (vehicle: Vehicle) => {
        setDeletingVehicle(vehicle);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingVehicle) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setVehicles(vehicles.filter((v) => v.id !== deletingVehicle.id));
        setIsDeleteDialogOpen(false);
        setIsLoading(false);
        toast({ title: "Vehicle Deleted", description: `${deletingVehicle.make} ${deletingVehicle.model} has been removed.`, variant: "destructive" });
        setDeletingVehicle(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "available": return <Badge className="bg-green-500">Available</Badge>;
            case "in_transit": return <Badge className="bg-blue-500">In Transit</Badge>;
            case "maintenance": return <Badge variant="destructive">Maintenance</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const stats = {
        total: vehicles.length,
        available: vehicles.filter((v) => v.status === "available").length,
        inTransit: vehicles.filter((v) => v.status === "in_transit").length,
        maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Fleet Vehicles</h1>
                    <p className="text-gray-600">Manage your fleet vehicles and track their status</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" />Add Vehicle</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Vehicle</DialogTitle>
                            <DialogDescription>Register a new vehicle in your fleet.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Registration</Label>
                                <Input value={formData.registration} onChange={(e) => setFormData({ ...formData, registration: e.target.value })} className="col-span-3" placeholder="TX-1234-AB" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Make</Label>
                                <Input value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} className="col-span-3" placeholder="Volvo" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Model</Label>
                                <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="col-span-3" placeholder="FH16" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Year</Label>
                                <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Type</Label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="col-span-3 px-3 py-2 border rounded-md">
                                    <option value="Heavy Truck">Heavy Truck</option>
                                    <option value="Medium Truck">Medium Truck</option>
                                    <option value="Van">Van</option>
                                    <option value="Pickup">Pickup</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Capacity (kg)</Label>
                                <Input type="number" value={formData.capacityWeight} onChange={(e) => setFormData({ ...formData, capacityWeight: parseInt(e.target.value) })} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Vehicle
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Vehicle</DialogTitle>
                        <DialogDescription>Update vehicle information.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Registration</Label>
                            <Input value={formData.registration} onChange={(e) => setFormData({ ...formData, registration: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Make</Label>
                            <Input value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Model</Label>
                            <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Year</Label>
                            <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Type</Label>
                            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="col-span-3 px-3 py-2 border rounded-md">
                                <option value="Heavy Truck">Heavy Truck</option>
                                <option value="Medium Truck">Medium Truck</option>
                                <option value="Van">Van</option>
                                <option value="Pickup">Pickup</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Capacity (kg)</Label>
                            <Input type="number" value={formData.capacityWeight} onChange={(e) => setFormData({ ...formData, capacityWeight: parseInt(e.target.value) })} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Vehicle Details</DialogTitle>
                        <DialogDescription>Complete information about this vehicle.</DialogDescription>
                    </DialogHeader>
                    {viewingVehicle && (
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Registration</p>
                                    <p className="font-medium">{viewingVehicle.registration}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    {getStatusBadge(viewingVehicle.status)}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Make</p>
                                    <p className="font-medium">{viewingVehicle.make}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Model</p>
                                    <p className="font-medium">{viewingVehicle.model}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Year</p>
                                    <p className="font-medium">{viewingVehicle.year}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <p className="font-medium">{viewingVehicle.type}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Capacity</p>
                                    <p className="font-medium">{viewingVehicle.capacityWeight.toLocaleString()} kg</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Active</p>
                                    <p className="font-medium">{viewingVehicle.isActive ? "Yes" : "No"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Last Service</p>
                                    <p className="font-medium">{viewingVehicle.lastService}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Next Service</p>
                                    <p className="font-medium">{viewingVehicle.nextService}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                        <Button onClick={() => { setIsViewDialogOpen(false); if (viewingVehicle) handleEdit(viewingVehicle); }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the vehicle <strong>{deletingVehicle?.make} {deletingVehicle?.model}</strong> ({deletingVehicle?.registration}). This action cannot be undone.
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

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available</CardTitle>
                        <Truck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{stats.available}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                        <Truck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-600">{stats.maintenance}</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vehicle List</CardTitle>
                    <CardDescription>All registered vehicles in your fleet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input placeholder="Search vehicles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Registration</TableHead>
                                <TableHead>Make / Model</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Next Service</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVehicles.map((vehicle) => (
                                <TableRow key={vehicle.id}>
                                    <TableCell className="font-medium">{vehicle.registration}</TableCell>
                                    <TableCell>{vehicle.make} {vehicle.model} ({vehicle.year})</TableCell>
                                    <TableCell>{vehicle.type}</TableCell>
                                    <TableCell>{vehicle.capacityWeight.toLocaleString()} kg</TableCell>
                                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            {vehicle.nextService}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleView(vehicle)} title="View">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(vehicle)} title="Edit">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(vehicle)} title="Delete" className="text-red-600 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
