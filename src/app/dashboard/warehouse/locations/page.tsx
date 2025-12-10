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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, MapPin, Warehouse, Package, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WarehouseLocation {
    id: string;
    warehouseId: string;
    warehouseName: string;
    code: string;
    zone: string;
    aisle: string;
    rack: string;
    level: string;
    position: string;
    locationType: string;
    capacityWeight: number;
    capacityVolume: number;
    currentUtilization: number;
    isActive: boolean;
}

const mockLocations: WarehouseLocation[] = [
    {
        id: "1",
        warehouseId: "wh1",
        warehouseName: "Dallas DC",
        code: "A-01-01-A",
        zone: "A",
        aisle: "01",
        rack: "01",
        level: "A",
        position: "1",
        locationType: "storage",
        capacityWeight: 500,
        capacityVolume: 2.5,
        currentUtilization: 75,
        isActive: true,
    },
    {
        id: "2",
        warehouseId: "wh1",
        warehouseName: "Dallas DC",
        code: "A-01-02-B",
        zone: "A",
        aisle: "01",
        rack: "02",
        level: "B",
        position: "1",
        locationType: "storage",
        capacityWeight: 500,
        capacityVolume: 2.5,
        currentUtilization: 45,
        isActive: true,
    },
    {
        id: "3",
        warehouseId: "wh1",
        warehouseName: "Dallas DC",
        code: "B-02-01-A",
        zone: "B",
        aisle: "02",
        rack: "01",
        level: "A",
        position: "1",
        locationType: "picking",
        capacityWeight: 300,
        capacityVolume: 1.5,
        currentUtilization: 90,
        isActive: true,
    },
    {
        id: "4",
        warehouseId: "wh2",
        warehouseName: "LA Fulfillment",
        code: "C-01-01-A",
        zone: "C",
        aisle: "01",
        rack: "01",
        level: "A",
        position: "1",
        locationType: "receiving",
        capacityWeight: 1000,
        capacityVolume: 5,
        currentUtilization: 30,
        isActive: true,
    },
    {
        id: "5",
        warehouseId: "wh2",
        warehouseName: "LA Fulfillment",
        code: "D-01-01-A",
        zone: "D",
        aisle: "01",
        rack: "01",
        level: "A",
        position: "1",
        locationType: "shipping",
        capacityWeight: 800,
        capacityVolume: 4,
        currentUtilization: 60,
        isActive: false,
    },
];

const locationTypes = [
    { value: "storage", label: "Storage" },
    { value: "picking", label: "Picking" },
    { value: "receiving", label: "Receiving" },
    { value: "shipping", label: "Shipping" },
    { value: "staging", label: "Staging" },
];

export default function WarehouseLocationsPage() {
    const { toast } = useToast();
    const [locations, setLocations] = useState<WarehouseLocation[]>(mockLocations);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(false);

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Selected location
    const [selectedLocation, setSelectedLocation] = useState<WarehouseLocation | null>(null);

    const [formData, setFormData] = useState({
        code: "",
        warehouseName: "Dallas DC",
        zone: "",
        aisle: "",
        rack: "",
        level: "",
        locationType: "storage",
        capacityWeight: 500,
        capacityVolume: 2.5,
        isActive: true
    });

    const filteredLocations = locations.filter((loc) => {
        const matchesSearch =
            loc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.zone.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || loc.locationType === typeFilter;
        return matchesSearch && matchesType;
    });

    const resetForm = () => {
        setFormData({
            code: "",
            warehouseName: "Dallas DC",
            zone: "",
            aisle: "",
            rack: "",
            level: "",
            locationType: "storage",
            capacityWeight: 500,
            capacityVolume: 2.5,
            isActive: true
        });
    };

    const handleCreate = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const newLocation: WarehouseLocation = {
            id: Date.now().toString(),
            warehouseId: "wh1", // Mock ID
            warehouseName: formData.warehouseName,
            code: formData.code || `${formData.zone}-${formData.aisle}-${formData.rack}-${formData.level}`,
            zone: formData.zone,
            aisle: formData.aisle,
            rack: formData.rack,
            level: formData.level,
            position: "1",
            locationType: formData.locationType,
            capacityWeight: formData.capacityWeight,
            capacityVolume: formData.capacityVolume,
            currentUtilization: 0,
            isActive: true,
        };
        setLocations([...locations, newLocation]);
        setIsCreateDialogOpen(false);
        resetForm();
        setIsLoading(false);
        toast({ title: "Location Added", description: `Location ${newLocation.code} created.` });
    };

    const handleEdit = (location: WarehouseLocation) => {
        setSelectedLocation(location);
        setFormData({
            code: location.code,
            warehouseName: location.warehouseName,
            zone: location.zone,
            aisle: location.aisle,
            rack: location.rack,
            level: location.level,
            locationType: location.locationType,
            capacityWeight: location.capacityWeight,
            capacityVolume: location.capacityVolume,
            isActive: location.isActive
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedLocation) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setLocations(locations.map(l =>
            l.id === selectedLocation.id
                ? {
                    ...l,
                    ...formData,
                    code: formData.code || `${formData.zone}-${formData.aisle}-${formData.rack}-${formData.level}`
                }
                : l
        ));
        setIsEditDialogOpen(false);
        setSelectedLocation(null);
        setIsLoading(false);
        toast({ title: "Location Updated", description: "Warehouse location details updated." });
    };

    const handleView = (location: WarehouseLocation) => {
        setSelectedLocation(location);
        setIsViewDialogOpen(true);
    };

    const handleDeleteClick = (location: WarehouseLocation) => {
        setSelectedLocation(location);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedLocation) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setLocations(locations.filter((l) => l.id !== selectedLocation.id));
        setIsDeleteDialogOpen(false);
        setSelectedLocation(null);
        setIsLoading(false);
        toast({ title: "Location Deleted", description: "Location removed from warehouse.", variant: "destructive" });
    };

    const getUtilizationColor = (util: number) => {
        if (util >= 90) return "text-red-600";
        if (util >= 70) return "text-yellow-600";
        return "text-green-600";
    };

    const stats = {
        total: locations.length,
        active: locations.filter((l) => l.isActive).length,
        storage: locations.filter((l) => l.locationType === "storage").length,
        avgUtilization: Math.round(locations.reduce((sum, l) => sum + l.currentUtilization, 0) / locations.length),
    };

    const LocationForm = () => (
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Warehouse</Label>
                <Input
                    value={formData.warehouseName}
                    onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Zone</Label>
                <Input
                    placeholder="A"
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Aisle</Label>
                <Input
                    placeholder="01"
                    value={formData.aisle}
                    onChange={(e) => setFormData({ ...formData, aisle: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Rack</Label>
                <Input
                    placeholder="01"
                    value={formData.rack}
                    onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Level</Label>
                <Input
                    placeholder="A"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Code</Label>
                <Input
                    placeholder="Auto-generated if empty"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <Select value={formData.locationType} onValueChange={(value) => setFormData({ ...formData, locationType: value })}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        {locationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Max Weight (kg)</Label>
                <Input
                    type="number"
                    value={formData.capacityWeight}
                    onChange={(e) => setFormData({ ...formData, capacityWeight: parseFloat(e.target.value) })}
                    className="col-span-3"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Warehouse Locations</h1>
                    <p className="text-gray-600">Manage storage locations, zones, and bin configurations</p>
                </div>
                <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <Warehouse className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Storage Locations</CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.storage}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
                        <Package className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${getUtilizationColor(stats.avgUtilization)}`}>
                            {stats.avgUtilization}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Location List</CardTitle>
                    <CardDescription>
                        All configured warehouse storage locations with utilization status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2 flex-1">
                            <Search className="h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {locationTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Zone</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Capacity (kg)</TableHead>
                                <TableHead>Utilization</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLocations.map((loc) => (
                                <TableRow key={loc.id}>
                                    <TableCell className="font-mono font-medium">{loc.code}</TableCell>
                                    <TableCell>{loc.warehouseName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">Zone {loc.zone}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{loc.locationType}</Badge>
                                    </TableCell>
                                    <TableCell>{loc.capacityWeight.toLocaleString()} kg</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${loc.currentUtilization >= 90 ? 'bg-red-500' :
                                                        loc.currentUtilization >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${loc.currentUtilization}%` }}
                                                />
                                            </div>
                                            <span className={`text-sm font-medium ${getUtilizationColor(loc.currentUtilization)}`}>
                                                {loc.currentUtilization}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={loc.isActive ? "default" : "secondary"}>
                                            {loc.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleView(loc)}><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(loc)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(loc)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Location</DialogTitle>
                        <DialogDescription>Create a new warehouse storage location.</DialogDescription>
                    </DialogHeader>
                    <LocationForm />
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Location</DialogTitle>
                        <DialogDescription>Update warehouse location details.</DialogDescription>
                    </DialogHeader>
                    <LocationForm />
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
                        <DialogTitle>Location Details</DialogTitle>
                        <DialogDescription>Details for {selectedLocation?.code}</DialogDescription>
                    </DialogHeader>
                    {selectedLocation && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground text-xs">Warehouse</Label>
                                    <div className="font-medium">{selectedLocation.warehouseName}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Type</Label>
                                    <div className="font-medium">{selectedLocation.locationType}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Position</Label>
                                    <div className="font-medium">Zone {selectedLocation.zone}, Aisle {selectedLocation.aisle}</div>
                                    <div className="font-medium text-xs text-muted-foreground">Rack {selectedLocation.rack}, Level {selectedLocation.level}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Capacity</Label>
                                    <div className="font-medium">{selectedLocation.capacityWeight} kg</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Utilization</Label>
                                    <div className={`font-medium ${getUtilizationColor(selectedLocation.currentUtilization)}`}>
                                        {selectedLocation.currentUtilization}%
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Status</Label>
                                    <Badge className="mt-1" variant={selectedLocation.isActive ? "default" : "secondary"}>
                                        {selectedLocation.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                        <Button onClick={() => { setIsViewDialogOpen(false); if (selectedLocation) handleEdit(selectedLocation); }}>
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
                            This will permanently delete location <strong>{selectedLocation?.code}</strong>.
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
