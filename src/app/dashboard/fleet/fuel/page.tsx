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
import { Plus, Search, Fuel, TrendingUp, DollarSign, Truck, Edit, Trash2, Eye, Loader2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FuelEntry {
    id: string;
    vehicleId: string;
    vehicleReg: string;
    driverId: string;
    driverName: string;
    date: string;
    quantity: number;
    pricePerLiter: number;
    totalCost: number;
    odometer: number;
    fuelStation: string;
}

const mockFuelEntries: FuelEntry[] = [
    { id: "1", vehicleId: "v1", vehicleReg: "TX-1234-AB", driverId: "d1", driverName: "John Smith", date: "2024-12-09", quantity: 120, pricePerLiter: 1.85, totalCost: 222, odometer: 125000, fuelStation: "Shell - Dallas" },
    { id: "2", vehicleId: "v2", vehicleReg: "TX-5678-CD", driverId: "d2", driverName: "Mike Johnson", date: "2024-12-08", quantity: 95, pricePerLiter: 1.82, totalCost: 172.9, odometer: 89500, fuelStation: "Chevron - Houston" },
    { id: "3", vehicleId: "v3", vehicleReg: "TX-9012-EF", driverId: "d3", driverName: "Sarah Williams", date: "2024-12-08", quantity: 45, pricePerLiter: 1.88, totalCost: 84.6, odometer: 45200, fuelStation: "Exxon - Austin" },
    { id: "4", vehicleId: "v1", vehicleReg: "TX-1234-AB", driverId: "d1", driverName: "John Smith", date: "2024-12-07", quantity: 110, pricePerLiter: 1.80, totalCost: 198, odometer: 124500, fuelStation: "BP - Fort Worth" },
    { id: "5", vehicleId: "v4", vehicleReg: "TX-3456-GH", driverId: "d4", driverName: "Tom Wilson", date: "2024-12-06", quantity: 85, pricePerLiter: 1.79, totalCost: 152.15, odometer: 67800, fuelStation: "Shell - San Antonio" },
];

export default function FuelPage() {
    const { toast } = useToast();
    const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>(mockFuelEntries);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Selected entry
    const [selectedEntry, setSelectedEntry] = useState<FuelEntry | null>(null);

    const [formData, setFormData] = useState({
        vehicleReg: "",
        driverName: "",
        date: new Date().toISOString().split("T")[0],
        quantity: 0,
        pricePerLiter: 1.85,
        odometer: 0,
        fuelStation: "",
    });

    const filteredEntries = fuelEntries.filter(
        (entry) =>
            entry.vehicleReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.fuelStation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            vehicleReg: "",
            driverName: "",
            date: new Date().toISOString().split("T")[0],
            quantity: 0,
            pricePerLiter: 1.85,
            odometer: 0,
            fuelStation: "",
        });
    };

    const handleCreate = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const newEntry: FuelEntry = {
            id: Date.now().toString(),
            vehicleId: "v-new",
            vehicleReg: formData.vehicleReg,
            driverId: "d-new",
            driverName: formData.driverName,
            date: formData.date,
            quantity: formData.quantity,
            pricePerLiter: formData.pricePerLiter,
            totalCost: formData.quantity * formData.pricePerLiter,
            odometer: formData.odometer,
            fuelStation: formData.fuelStation,
        };
        setFuelEntries([newEntry, ...fuelEntries]);
        setIsCreateDialogOpen(false);
        resetForm();
        setIsLoading(false);
        toast({ title: "Fuel Entry Added", description: "Fuel record has been saved successfully." });
    };

    const handleEdit = (entry: FuelEntry) => {
        setSelectedEntry(entry);
        setFormData({
            vehicleReg: entry.vehicleReg,
            driverName: entry.driverName,
            date: entry.date,
            quantity: entry.quantity,
            pricePerLiter: entry.pricePerLiter,
            odometer: entry.odometer,
            fuelStation: entry.fuelStation,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedEntry) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setFuelEntries(fuelEntries.map(e =>
            e.id === selectedEntry.id
                ? {
                    ...e,
                    ...formData,
                    totalCost: formData.quantity * formData.pricePerLiter
                }
                : e
        ));
        setIsEditDialogOpen(false);
        setSelectedEntry(null);
        setIsLoading(false);
        toast({ title: "Fuel Entry Updated", description: "Fuel record has been modified." });
    };

    const handleView = (entry: FuelEntry) => {
        setSelectedEntry(entry);
        setIsViewDialogOpen(true);
    };

    const handleDeleteClick = (entry: FuelEntry) => {
        setSelectedEntry(entry);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedEntry) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setFuelEntries(fuelEntries.filter((e) => e.id !== selectedEntry.id));
        setIsDeleteDialogOpen(false);
        setSelectedEntry(null);
        setIsLoading(false);
        toast({ title: "Fuel Entry Deleted", description: "Record has been removed permanently.", variant: "destructive" });
    };

    const stats = {
        totalLiters: fuelEntries.reduce((sum, e) => sum + e.quantity, 0),
        totalCost: fuelEntries.reduce((sum, e) => sum + e.totalCost, 0),
        avgPrice: fuelEntries.reduce((sum, e) => sum + e.pricePerLiter, 0) / (fuelEntries.length || 1),
        entries: fuelEntries.length,
    };

    const FuelForm = () => (
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Date</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Vehicle</Label>
                <Input value={formData.vehicleReg} onChange={(e) => setFormData({ ...formData, vehicleReg: e.target.value })} className="col-span-3" placeholder="TX-1234-AB" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Driver</Label>
                <Input value={formData.driverName} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })} className="col-span-3" placeholder="John Smith" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Quantity (L)</Label>
                <Input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Price/Liter</Label>
                <Input type="number" step="0.01" value={formData.pricePerLiter} onChange={(e) => setFormData({ ...formData, pricePerLiter: parseFloat(e.target.value) })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Odometer</Label>
                <Input type="number" value={formData.odometer} onChange={(e) => setFormData({ ...formData, odometer: parseInt(e.target.value) })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Station</Label>
                <Input value={formData.fuelStation} onChange={(e) => setFormData({ ...formData, fuelStation: e.target.value })} className="col-span-3" placeholder="Shell - Dallas" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Fuel Management</h1>
                    <p className="text-gray-600">Track fuel consumption and costs for your fleet</p>
                </div>
                <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />Add Fuel Entry
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Fuel</CardTitle>
                        <Fuel className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalLiters.toLocaleString()} L</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Price/Liter</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.avgPrice.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Average</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entries</CardTitle>
                        <Truck className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.entries}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fuel Entries</CardTitle>
                    <CardDescription>Recent fuel purchases and consumption records.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input placeholder="Search entries..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price/L</TableHead>
                                <TableHead>Total Cost</TableHead>
                                <TableHead>Odometer</TableHead>
                                <TableHead>Station</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEntries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.date}</TableCell>
                                    <TableCell className="font-medium">{entry.vehicleReg}</TableCell>
                                    <TableCell>{entry.driverName}</TableCell>
                                    <TableCell><Badge variant="outline">{entry.quantity} L</Badge></TableCell>
                                    <TableCell>${entry.pricePerLiter.toFixed(2)}</TableCell>
                                    <TableCell className="font-medium">${entry.totalCost.toFixed(2)}</TableCell>
                                    <TableCell>{entry.odometer.toLocaleString()} km</TableCell>
                                    <TableCell>{entry.fuelStation}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleView(entry)}><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(entry)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
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
                        <DialogTitle>Add Fuel Entry</DialogTitle>
                        <DialogDescription>Record a new fuel purchase.</DialogDescription>
                    </DialogHeader>
                    <FuelForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Entry
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Fuel Entry</DialogTitle>
                        <DialogDescription>Update fuel record details.</DialogDescription>
                    </DialogHeader>
                    <FuelForm />
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
                        <DialogTitle>Fuel Usage Details</DialogTitle>
                        <DialogDescription>Record for {selectedEntry?.vehicleReg} on {selectedEntry?.date}</DialogDescription>
                    </DialogHeader>
                    {selectedEntry && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground text-xs">Vehicle</Label>
                                    <div className="font-medium flex items-center gap-1"><Truck className="h-3 w-3" /> {selectedEntry.vehicleReg}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Driver</Label>
                                    <div className="font-medium">{selectedEntry.driverName}</div>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-muted-foreground text-xs">Fuel Station</Label>
                                    <div className="font-medium">{selectedEntry.fuelStation}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Total Cost</Label>
                                    <div className="font-medium text-lg text-green-600">${selectedEntry.totalCost.toFixed(2)}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Quantity:</span>
                                        <span>{selectedEntry.quantity} L</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Price/L:</span>
                                        <span>${selectedEntry.pricePerLiter.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="col-span-2 pt-2 border-t">
                                    <Label className="text-muted-foreground text-xs">Odometer Reading</Label>
                                    <div className="font-medium font-mono">{selectedEntry.odometer.toLocaleString()} km</div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                        <Button onClick={() => { setIsViewDialogOpen(false); if (selectedEntry) handleEdit(selectedEntry); }}>
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
                            This will permanently delete the fuel record for <strong>{selectedEntry?.vehicleReg}</strong> dated <strong>{selectedEntry?.date}</strong>.
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
