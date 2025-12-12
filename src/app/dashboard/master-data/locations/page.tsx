"use client";

import { useState, useEffect } from "react";
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
import { Plus, Search, Edit, Trash2, Eye, MapPin, Building, Plane, Ship, Package, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Location {
    id: string;
    code: string;
    name: string;
    type: string;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postalCode: string | null;
    latitude: number | null;
    longitude: number | null;
    isActive: boolean;
}

const locationTypes = [
    { value: "warehouse", label: "Warehouse", icon: Building },
    { value: "port", label: "Port", icon: Ship },
    { value: "airport", label: "Airport", icon: Plane },
    { value: "fulfillment_center", label: "Fulfillment Center", icon: Package },
    { value: "cross_dock", label: "Cross Dock", icon: MapPin },
    { value: "customer", label: "Customer Location", icon: MapPin },
];

export default function LocationsPage() {
    const { toast } = useToast();
    const [locations, setLocations] = useState<Location[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Selected location
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        type: "warehouse",
        address: "",
        city: "",
        state: "",
        country: "USA",
        postalCode: "",
        latitude: "",
        longitude: "",
        isActive: true
    });

    const fetchLocations = async () => {
        try {
            const res = await fetch("/api/locations");
            if (!res.ok) throw new Error("Failed to fetch locations");
            const data = await res.json();
            setLocations(data);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load locations", variant: "destructive" });
        } finally {
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const filteredLocations = locations.filter(
        (location) =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (location.code && location.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (location.city && location.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const resetForm = () => {
        setFormData({
            code: "",
            name: "",
            type: "warehouse",
            address: "",
            city: "",
            state: "",
            country: "USA",
            postalCode: "",
            latitude: "",
            longitude: "",
            isActive: true
        });
    };

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/locations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    type: formData.type,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    postalCode: formData.postalCode,
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    status: formData.isActive ? "Active" : "Inactive"
                }),
            });

            if (!res.ok) throw new Error("Failed to create location");

            await fetchLocations();
            setIsCreateDialogOpen(false);
            resetForm();
            toast({ title: "Location Added", description: `${formData.name} has been created.` });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to create location", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (location: Location) => {
        setSelectedLocation(location);
        setFormData({
            code: location.code,
            name: location.name,
            type: location.type,
            address: location.address || "",
            city: location.city || "",
            state: location.state || "",
            country: location.country || "",
            postalCode: location.postalCode || "",
            latitude: location.latitude?.toString() || "",
            longitude: location.longitude?.toString() || "",
            isActive: location.isActive
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedLocation) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/locations/${selectedLocation.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    type: formData.type,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    postalCode: formData.postalCode,
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    status: formData.isActive ? "Active" : "Inactive"
                }),
            });

            if (!res.ok) throw new Error("Failed to update location");

            await fetchLocations();
            setIsEditDialogOpen(false);
            setSelectedLocation(null);
            toast({ title: "Location Updated", description: "Location details modified." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to update location", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleView = (location: Location) => {
        setSelectedLocation(location);
        setIsViewDialogOpen(true);
    };

    const handleDeleteClick = (location: Location) => {
        setSelectedLocation(location);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedLocation) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/locations/${selectedLocation.id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete location");

            await fetchLocations();
            setIsDeleteDialogOpen(false);
            setSelectedLocation(null);
            toast({ title: "Location Deleted", description: "Location removed from database.", variant: "destructive" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to delete location", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const getTypeDetails = (type: string) => {
        return locationTypes.find((t) => t.value === type) || { label: type, icon: MapPin };
    };

    const LocationForm = () => (
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Code</Label>
                <Input
                    value={formData.code}
                    disabled
                    placeholder="Auto-generated"
                    className="col-span-3 bg-muted"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
                <Label className="text-right">Address</Label>
                <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">City</Label>
                <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">State</Label>
                <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Country</Label>
                <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Zip Code</Label>
                <Input
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Lat/Long</Label>
                <div className="col-span-3 flex gap-2">
                    <Input
                        placeholder="Lat"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    />
                    <Input
                        placeholder="Long"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
                    <p className="text-gray-600">Manage warehouses, ports, and delivery points</p>
                </div>
                <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />Add Location
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{locations.length}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
                        <Building className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {locations.filter(l => l.type === 'warehouse').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <MapPin className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{locations.filter(l => l.isActive).length}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Global</CardTitle>
                        <MapPin className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-purple-600">{new Set(locations.map(l => l.country).filter(Boolean)).size} Countries</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Location List</CardTitle>
                    <CardDescription>
                        A list of all locations in your network.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    {isPageLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>City/State</TableHead>
                                    <TableHead>Coordinates</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLocations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24">No locations found.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLocations.map((location) => {
                                        const typeInfo = getTypeDetails(location.type);
                                        const TypeIcon = typeInfo.icon;
                                        return (
                                            <TableRow key={location.id}>
                                                <TableCell className="font-medium">{location.code || "-"}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span>{location.name}</span>
                                                        <span className="text-xs text-muted-foreground">{location.address || "-"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="flex w-fit items-center gap-1">
                                                        <TypeIcon className="h-3 w-3" />
                                                        {typeInfo.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{[location.city, location.state].filter(Boolean).join(", ") || "-"}</TableCell>
                                                <TableCell>
                                                    {location.latitude && location.longitude ? (
                                                        <span className="text-xs text-gray-500 font-mono">
                                                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                                        </span>
                                                    ) : <span className="text-xs text-muted-foreground">-</span>}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={location.isActive ? "default" : "secondary"}>
                                                        {location.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-1">
                                                        <Button variant="ghost" size="sm" onClick={() => handleView(location)}><Eye className="h-4 w-4" /></Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(location)}><Edit className="h-4 w-4" /></Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(location)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Location</DialogTitle>
                        <DialogDescription>Create a new location record.</DialogDescription>
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Location</DialogTitle>
                        <DialogDescription>Update location information.</DialogDescription>
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
                        <DialogDescription>Full information for {selectedLocation?.code}</DialogDescription>
                    </DialogHeader>
                    {selectedLocation && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground text-xs">Name</Label>
                                    <div className="font-medium">{selectedLocation.name}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Type</Label>
                                    <div className="font-medium">{getTypeDetails(selectedLocation.type).label}</div>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-muted-foreground text-xs">Address</Label>
                                    <div className="font-medium">{selectedLocation.address || "-"}</div>
                                    <div className="font-medium">{[selectedLocation.city, selectedLocation.state, selectedLocation.postalCode].filter(Boolean).join(", ")}</div>
                                    <div className="font-medium">{selectedLocation.country || "-"}</div>
                                </div>
                                {selectedLocation.latitude && selectedLocation.longitude && (
                                    <div className="col-span-2">
                                        <Label className="text-muted-foreground text-xs">Coordinates</Label>
                                        <div className="font-medium flex items-center gap-2">
                                            <MapPin className="h-3 w-3" />
                                            {selectedLocation.latitude}, {selectedLocation.longitude}
                                        </div>
                                    </div>
                                )}
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
                            This will permanently delete <strong>{selectedLocation?.name}</strong>.
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
