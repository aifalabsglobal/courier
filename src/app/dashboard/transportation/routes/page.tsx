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
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Route, Clock, MapPin } from "lucide-react";

interface RouteData {
    id: string;
    origin: string;
    destination: string;
    distance: number;
    normalHours: number;
    isActive: boolean;
}

const mockRoutes: RouteData[] = [
    {
        id: "1",
        origin: "Dallas, TX",
        destination: "Houston, TX",
        distance: 385,
        normalHours: 4.5,
        isActive: true,
    },
    {
        id: "2",
        origin: "Los Angeles, CA",
        destination: "San Diego, CA",
        distance: 195,
        normalHours: 2.5,
        isActive: true,
    },
    {
        id: "3",
        origin: "Chicago, IL",
        destination: "Detroit, MI",
        distance: 450,
        normalHours: 5,
        isActive: true,
    },
    {
        id: "4",
        origin: "Miami, FL",
        destination: "Orlando, FL",
        distance: 380,
        normalHours: 4,
        isActive: false,
    },
    {
        id: "5",
        origin: "Seattle, WA",
        destination: "Portland, OR",
        distance: 280,
        normalHours: 3,
        isActive: true,
    },
    {
        id: "6",
        origin: "New York, NY",
        destination: "Boston, MA",
        distance: 350,
        normalHours: 4,
        isActive: true,
    },
];

export default function RoutesPage() {
    const [routes, setRoutes] = useState<RouteData[]>(mockRoutes);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        distance: 0,
        normalHours: 0,
    });

    const filteredRoutes = routes.filter(
        (route) =>
            route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        const newRoute: RouteData = {
            id: Date.now().toString(),
            ...formData,
            isActive: true,
        };
        setRoutes([...routes, newRoute]);
        setIsCreateDialogOpen(false);
        setFormData({ origin: "", destination: "", distance: 0, normalHours: 0 });
    };

    const handleDelete = (id: string) => {
        setRoutes(routes.filter((r) => r.id !== id));
    };

    const toggleActive = (id: string) => {
        setRoutes(routes.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Routes</h1>
                    <p className="text-gray-600">Manage transportation routes and lane configurations</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Route
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Route</DialogTitle>
                            <DialogDescription>
                                Create a new transportation route between two locations.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="origin" className="text-right">Origin</Label>
                                <Input
                                    id="origin"
                                    placeholder="City, State"
                                    value={formData.origin}
                                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="destination" className="text-right">Destination</Label>
                                <Input
                                    id="destination"
                                    placeholder="City, State"
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="distance" className="text-right">Distance (km)</Label>
                                <Input
                                    id="distance"
                                    type="number"
                                    value={formData.distance}
                                    onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="normalHours" className="text-right">Transit Time (hrs)</Label>
                                <Input
                                    id="normalHours"
                                    type="number"
                                    step="0.5"
                                    value={formData.normalHours}
                                    onChange={(e) => setFormData({ ...formData, normalHours: parseFloat(e.target.value) })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleCreate}>Create Route</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
                        <Route className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{routes.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {routes.reduce((sum, r) => sum + r.distance, 0).toLocaleString()} km
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Transit Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(routes.reduce((sum, r) => sum + r.normalHours, 0) / routes.length).toFixed(1)} hrs
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Route List</CardTitle>
                    <CardDescription>
                        All configured transportation routes with distance and transit time information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search routes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Origin</TableHead>
                                <TableHead>Destination</TableHead>
                                <TableHead>Distance</TableHead>
                                <TableHead>Transit Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRoutes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-green-500" />
                                            {route.origin}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-red-500" />
                                            {route.destination}
                                        </div>
                                    </TableCell>
                                    <TableCell>{route.distance.toLocaleString()} km</TableCell>
                                    <TableCell>{route.normalHours} hrs</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={route.isActive ? "default" : "secondary"}
                                            className="cursor-pointer"
                                            onClick={() => toggleActive(route.id)}
                                        >
                                            {route.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(route.id)}>
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
