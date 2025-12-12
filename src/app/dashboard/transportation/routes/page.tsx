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
import { Plus, Search, Edit, Trash2, Route, Clock, MapPin, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RouteData {
    id: string;
    origin: string;
    destination: string;
    distance: number | null;
    normalHours: number | null;
    isActive: boolean;
}

export default function RoutesPage() {
    const { toast } = useToast();
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        distance: 0,
        normalHours: 0,
        isActive: true
    });

    const fetchRoutes = async () => {
        try {
            const res = await fetch("/api/routes");
            if (!res.ok) throw new Error("Failed to fetch routes");
            const data = await res.json();
            setRoutes(data);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load routes", variant: "destructive" });
        } finally {
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const filteredRoutes = routes.filter(
        (route) =>
            route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({ origin: "", destination: "", distance: 0, normalHours: 0, isActive: true });
    };

    const handleCreate = async () => {
        if (!formData.origin || !formData.destination) {
            toast({ title: "Error", description: "Origin and destination are required", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/routes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Failed to create route");
            await fetchRoutes();
            setIsCreateDialogOpen(false);
            resetForm();
            toast({ title: "Route Created", description: `Route from ${formData.origin} to ${formData.destination} added.` });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to create route", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (route: RouteData) => {
        setSelectedRoute(route);
        setFormData({
            origin: route.origin,
            destination: route.destination,
            distance: route.distance || 0,
            normalHours: route.normalHours || 0,
            isActive: route.isActive
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedRoute) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/routes/${selectedRoute.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Failed to update route");
            await fetchRoutes();
            setIsEditDialogOpen(false);
            setSelectedRoute(null);
            toast({ title: "Route Updated", description: "Route details updated." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to update route", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleView = (route: RouteData) => {
        setSelectedRoute(route);
        setIsViewDialogOpen(true);
    };

    const handleDeleteClick = (route: RouteData) => {
        setSelectedRoute(route);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRoute) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/routes/${selectedRoute.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete route");
            await fetchRoutes();
            setIsDeleteDialogOpen(false);
            setSelectedRoute(null);
            toast({ title: "Route Deleted", description: "Route removed.", variant: "destructive" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to delete route", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: routes.length,
        totalDistance: routes.reduce((sum, r) => sum + (r.distance || 0), 0),
        avgTransit: routes.length > 0 ? routes.reduce((sum, r) => sum + (r.normalHours || 0), 0) / routes.length : 0
    };

    const RouteForm = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Origin</Label>
                <Input
                    placeholder="City, State"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Destination</Label>
                <Input
                    placeholder="City, State"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Distance (km)</Label>
                <Input
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Transit (hrs)</Label>
                <Input
                    type="number"
                    step="0.5"
                    value={formData.normalHours}
                    onChange={(e) => setFormData({ ...formData, normalHours: parseFloat(e.target.value) || 0 })}
                    className="col-span-3"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Routes</h1>
                    <p className="text-gray-600">Manage transportation routes and lane configurations</p>
                </div>
                <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Route
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
                        <Route className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.totalDistance.toLocaleString()} km</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Transit Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.avgTransit.toFixed(1)} hrs</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Route List</CardTitle>
                    <CardDescription>All configured transportation routes.</CardDescription>
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
                    {isPageLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
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
                                {filteredRoutes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">No routes found.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRoutes.map((route) => (
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
                                            <TableCell>{route.distance?.toLocaleString() || 0} km</TableCell>
                                            <TableCell>{route.normalHours || 0} hrs</TableCell>
                                            <TableCell>
                                                <Badge variant={route.isActive ? "default" : "secondary"}>
                                                    {route.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleView(route)}><Eye className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(route)}><Edit className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(route)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Route</DialogTitle>
                        <DialogDescription>Create a new transportation route.</DialogDescription>
                    </DialogHeader>
                    <RouteForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Route</DialogTitle>
                        <DialogDescription>Update route information.</DialogDescription>
                    </DialogHeader>
                    <RouteForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Route Details</DialogTitle>
                        <DialogDescription>{selectedRoute?.origin} to {selectedRoute?.destination}</DialogDescription>
                    </DialogHeader>
                    {selectedRoute && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground text-xs">Origin</Label>
                                    <div className="font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedRoute.origin}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Destination</Label>
                                    <div className="font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedRoute.destination}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Distance</Label>
                                    <div className="font-medium">{selectedRoute.distance || 0} km</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Transit Time</Label>
                                    <div className="font-medium">{selectedRoute.normalHours || 0} hrs</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Status</Label>
                                    <Badge className="mt-1" variant={selectedRoute.isActive ? "default" : "secondary"}>
                                        {selectedRoute.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                        <Button onClick={() => { setIsViewDialogOpen(false); if (selectedRoute) handleEdit(selectedRoute); }}>
                            <Edit className="h-4 w-4 mr-2" />Edit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the route from <strong>{selectedRoute?.origin}</strong> to <strong>{selectedRoute?.destination}</strong>.
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
