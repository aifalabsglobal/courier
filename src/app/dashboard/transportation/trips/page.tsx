"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Truck, Eye, Loader2, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Trip {
  id: string;
  tripNo: string;
  origin: string | null;
  destination: string | null;
  status: string;
  distance: number | null;
  estimatedHours: number | null;
  plannedDeparture: string | null;
  plannedArrival: string | null;
  vehicle?: { registration: string } | null;
  driver?: { name: string } | null;
}

interface Vehicle { id: string; registration: string; }
interface Driver { id: string; name: string; }

export default function TripsPage() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const [formData, setFormData] = useState({
    vehicleId: "", driverId: "", origin: "", destination: "", distance: "", estimatedHours: "", status: "PLANNED"
  });

  const fetchData = async () => {
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        fetch("/api/trips"), fetch("/api/vehicles"), fetch("/api/drivers")
      ]);
      if (tripsRes.ok) setTrips(await tripsRes.json());
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
      if (driversRes.ok) setDrivers(await driversRes.json());
    } catch { toast({ title: "Error", description: "Failed to load data", variant: "destructive" }); }
    finally { setIsPageLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredTrips = trips.filter(t =>
    t.tripNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.origin && t.origin.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => setFormData({ vehicleId: "", driverId: "", origin: "", destination: "", distance: "", estimatedHours: "", status: "PLANNED" });

  const handleCreate = async () => {
    if (!formData.origin || !formData.destination) { toast({ title: "Error", description: "Origin and destination required", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/trips", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      await fetchData(); setIsCreateDialogOpen(false); resetForm();
      toast({ title: "Trip Created" });
    } catch { toast({ title: "Error", description: "Failed to create trip", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const handleEdit = (t: Trip) => {
    setSelectedTrip(t);
    setFormData({
      vehicleId: "", driverId: "", origin: t.origin || "", destination: t.destination || "",
      distance: t.distance?.toString() || "", estimatedHours: t.estimatedHours?.toString() || "", status: t.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedTrip) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/trips/${selectedTrip.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      await fetchData(); setIsEditDialogOpen(false); setSelectedTrip(null);
      toast({ title: "Trip Updated" });
    } catch { toast({ title: "Error", description: "Failed to update", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTrip) return;
    setIsLoading(true);
    try {
      await fetch(`/api/trips/${selectedTrip.id}`, { method: "DELETE" });
      await fetchData(); setIsDeleteDialogOpen(false); setSelectedTrip(null);
      toast({ title: "Trip Deleted", variant: "destructive" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const getStatusColor = (s: string) => {
    if (s === "COMPLETED" || s === "DELIVERED") return "default";
    if (s === "IN_TRANSIT" || s === "DISPATCHED") return "secondary";
    return "outline";
  };

  const TripForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Vehicle</Label>
        <Select value={formData.vehicleId} onValueChange={(v) => setFormData({ ...formData, vehicleId: v })}>
          <SelectTrigger className="col-span-3"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
          <SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.registration}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Driver</Label>
        <Select value={formData.driverId} onValueChange={(v) => setFormData({ ...formData, driverId: v })}>
          <SelectTrigger className="col-span-3"><SelectValue placeholder="Select driver" /></SelectTrigger>
          <SelectContent>{drivers.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Origin</Label><Input value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Destination</Label><Input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Distance (km)</Label><Input type="number" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">EST Hours</Label><Input type="number" step="0.5" value={formData.estimatedHours} onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Status</Label>
        <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
          <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="PLANNED">Planned</SelectItem><SelectItem value="DISPATCHED">Dispatched</SelectItem><SelectItem value="IN_TRANSIT">In Transit</SelectItem><SelectItem value="DELIVERED">Delivered</SelectItem><SelectItem value="COMPLETED">Completed</SelectItem></SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900">Trips</h1><p className="text-gray-600">Manage transportation trips</p></div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />New Trip</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Trips</CardTitle><Truck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{trips.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Planned</CardTitle><Clock className="h-4 w-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{trips.filter(t => t.status === "PLANNED").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">In Transit</CardTitle><Truck className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{trips.filter(t => t.status === "IN_TRANSIT").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completed</CardTitle><Truck className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{trips.filter(t => t.status === "COMPLETED" || t.status === "DELIVERED").length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Trip List</CardTitle><CardDescription>All trips</CardDescription></CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
          {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
            <Table>
              <TableHeader><TableRow><TableHead>Trip No</TableHead><TableHead>Route</TableHead><TableHead>Vehicle</TableHead><TableHead>Driver</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredTrips.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No trips found.</TableCell></TableRow> :
                  filteredTrips.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.tripNo}</TableCell>
                      <TableCell><div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{t.origin || "-"} → {t.destination || "-"}</div></TableCell>
                      <TableCell>{t.vehicle?.registration || "-"}</TableCell>
                      <TableCell>{t.driver?.name || "-"}</TableCell>
                      <TableCell><Badge variant={getStatusColor(t.status)}>{t.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedTrip(t); setIsViewDialogOpen(true); }}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(t)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedTrip(t); setIsDeleteDialogOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>New Trip</DialogTitle><DialogDescription>Create a new trip.</DialogDescription></DialogHeader><TripForm /><DialogFooter><Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Trip</DialogTitle></DialogHeader><TripForm /><DialogFooter><Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button><Button onClick={handleUpdate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}><DialogContent><DialogHeader><DialogTitle>Trip Details</DialogTitle><DialogDescription>{selectedTrip?.tripNo}</DialogDescription></DialogHeader>{selectedTrip && <div className="grid gap-4 py-4 grid-cols-2"><div><Label className="text-muted-foreground text-xs">Route</Label><div className="font-medium">{selectedTrip.origin} → {selectedTrip.destination}</div></div><div><Label className="text-muted-foreground text-xs">Vehicle</Label><div className="font-medium">{selectedTrip.vehicle?.registration || "-"}</div></div><div><Label className="text-muted-foreground text-xs">Driver</Label><div className="font-medium">{selectedTrip.driver?.name || "-"}</div></div><div><Label className="text-muted-foreground text-xs">Distance</Label><div className="font-medium">{selectedTrip.distance || 0} km</div></div><div><Label className="text-muted-foreground text-xs">Status</Label><Badge variant={getStatusColor(selectedTrip.status)}>{selectedTrip.status}</Badge></div></div>}<DialogFooter><Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button></DialogFooter></DialogContent></Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Trip?</AlertDialogTitle><AlertDialogDescription>This will permanently delete <strong>{selectedTrip?.tripNo}</strong>.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}