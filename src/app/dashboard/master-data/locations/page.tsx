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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Eye, MapPin } from "lucide-react";

interface Location {
    id: string;
    code: string;
    name: string;
    type: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number | null;
    longitude: number | null;
    isActive: boolean;
}

const mockLocations: Location[] = [
    {
        id: "1",
        code: "LOC001",
        name: "Main Distribution Center",
        type: "warehouse",
        address: "123 Logistics Way",
        city: "Dallas",
        state: "TX",
        country: "USA",
        postalCode: "75201",
        latitude: 32.7767,
        longitude: -96.7970,
        isActive: true,
    },
    {
        id: "2",
        code: "LOC002",
        name: "Port of Los Angeles",
        type: "port",
        address: "425 S Palos Verdes St",
        city: "San Pedro",
        state: "CA",
        country: "USA",
        postalCode: "90731",
        latitude: 33.7407,
        longitude: -118.2777,
        isActive: true,
    },
    {
        id: "3",
        code: "LOC003",
        name: "Chicago O'Hare Hub",
        type: "airport",
        address: "10000 W O'Hare Ave",
        city: "Chicago",
        state: "IL",
        country: "USA",
        postalCode: "60666",
        latitude: 41.9742,
        longitude: -87.9073,
        isActive: true,
    },
    {
        id: "4",
        code: "LOC004",
        name: "East Coast Fulfillment",
        type: "fulfillment_center",
        address: "500 Commerce Drive",
        city: "Newark",
        state: "NJ",
        country: "USA",
        postalCode: "07102",
        latitude: 40.7357,
        longitude: -74.1724,
        isActive: false,
    },
];

const locationTypes = [
    { value: "warehouse", label: "Warehouse" },
    { value: "port", label: "Port" },
    { value: "airport", label: "Airport" },
    { value: "fulfillment_center", label: "Fulfillment Center" },
    { value: "cross_dock", label: "Cross Dock" },
    { value: "customer", label: "Customer Location" },
];

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>(mockLocations);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        type: "warehouse",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        latitude: "",
        longitude: "",
    });

    const filteredLocations = locations.filter(
        (location) =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        const newLocation: Location = {
            id: Date.now().toString(),
            code: formData.code,
            name: formData.name,
            type: formData.type,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postalCode: formData.postalCode,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
            isActive: true,
        };
        setLocations([...locations, newLocation]);
        setIsCreateDialogOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            code: "",
            name: "",
            type: "warehouse",
            address: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            latitude: "",
            longitude: "",
        });
    };

    const handleEdit = (location: Location) => {
        setEditingLocation(location);
        setFormData({
            code: location.code,
            name: location.name,
            type: location.type,
            address: location.address,
            city: location.city,
            state: location.state,
            country: location.country,
            postalCode: location.postalCode,
            latitude: location.latitude?.toString() || "",
            longitude: location.longitude?.toString() || "",
        });
    };

    const handleUpdate = () => {
        if (editingLocation) {
            setLocations(
                locations.map((l) =>
                    l.id === editingLocation.id
                        ? {
                            ...l,
                            ...formData,
                            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                        }
                        : l
                )
            );
            setEditingLocation(null);
            resetForm();
        }
    };

    const handleDelete = (id: string) => {
        setLocations(locations.filter((l) => l.id !== id));
    };

    const getTypeLabel = (type: string) => {
        return locationTypes.find((t) => t.value === type)?.label || type;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
                    <p className="text-gray-600">Manage warehouses, ports, and delivery points</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Location
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Location</DialogTitle>
                            <DialogDescription>
                                Create a new location record. Fill in the required information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="code" className="text-right">Code</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">Type</Label>
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
                                <Label htmlFor="address" className="text-right">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="city" className="text-right">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="state" className="text-right">State</Label>
                                <Input
                                    id="state"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="country" className="text-right">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="postalCode" className="text-right">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="latitude" className="text-right">Latitude</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="longitude" className="text-right">Longitude</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    value={formData.longitude}
                                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleCreate}>Create Location</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Location List</CardTitle>
                    <CardDescription>
                        A list of all locations in your network including warehouses, ports, and hubs.
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Coordinates</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLocations.map((location) => (
                                <TableRow key={location.id}>
                                    <TableCell className="font-medium">{location.code}</TableCell>
                                    <TableCell>{location.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{getTypeLabel(location.type)}</Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[150px] truncate">{location.address}</TableCell>
                                    <TableCell>{location.city}, {location.state}</TableCell>
                                    <TableCell>{location.country}</TableCell>
                                    <TableCell>
                                        {location.latitude && location.longitude ? (
                                            <span className="text-xs text-gray-500">
                                                <MapPin className="h-3 w-3 inline mr-1" />
                                                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400">Not set</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={location.isActive ? "default" : "secondary"}>
                                            {location.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(location)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(location.id)}>
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

            {/* Edit Dialog */}
            <Dialog open={!!editingLocation} onOpenChange={() => setEditingLocation(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Location</DialogTitle>
                        <DialogDescription>
                            Update location information. Make sure to save your changes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-code" className="text-right">Code</Label>
                            <Input
                                id="edit-code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-type" className="text-right">Type</Label>
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
                            <Label htmlFor="edit-city" className="text-right">City</Label>
                            <Input
                                id="edit-city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-country" className="text-right">Country</Label>
                            <Input
                                id="edit-country"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleUpdate}>Update Location</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
