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
import { Plus, Search, Edit, Trash2, MapPin, Warehouse, Package } from "lucide-react";

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
    const [locations, setLocations] = useState<WarehouseLocation[]>(mockLocations);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        zone: "",
        aisle: "",
        rack: "",
        level: "",
        locationType: "storage",
        capacityWeight: 500,
        capacityVolume: 2.5,
    });

    const filteredLocations = locations.filter((loc) => {
        const matchesSearch =
            loc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.zone.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || loc.locationType === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleCreate = () => {
        const newLocation: WarehouseLocation = {
            id: Date.now().toString(),
            warehouseId: "wh1",
            warehouseName: "Dallas DC",
            code: formData.code,
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
        setFormData({
            code: "",
            zone: "",
            aisle: "",
            rack: "",
            level: "",
            locationType: "storage",
            capacityWeight: 500,
            capacityVolume: 2.5,
        });
    };

    const handleDelete = (id: string) => {
        setLocations(locations.filter((l) => l.id !== id));
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Warehouse Locations</h1>
                    <p className="text-gray-600">Manage storage locations, zones, and bin configurations</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Location
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Location</DialogTitle>
                            <DialogDescription>
                                Create a new warehouse storage location.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="code" className="text-right">Code</Label>
                                <Input
                                    id="code"
                                    placeholder="A-01-01-A"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="zone" className="text-right">Zone</Label>
                                <Input
                                    id="zone"
                                    placeholder="A"
                                    value={formData.zone}
                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="aisle" className="text-right">Aisle</Label>
                                <Input
                                    id="aisle"
                                    placeholder="01"
                                    value={formData.aisle}
                                    onChange={(e) => setFormData({ ...formData, aisle: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rack" className="text-right">Rack</Label>
                                <Input
                                    id="rack"
                                    placeholder="01"
                                    value={formData.rack}
                                    onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="level" className="text-right">Level</Label>
                                <Input
                                    id="level"
                                    placeholder="A"
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="locationType" className="text-right">Type</Label>
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
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleCreate}>Create Location</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(loc.id)}>
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
