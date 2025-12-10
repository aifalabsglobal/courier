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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Edit, Trash2, Eye, Truck, MapPin, Clock, Loader2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Trip {
  id: string;
  tripNo: string;
  orderIds: string[];
  vehicleRegistration: string;
  driverName: string;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedHours: number;
  plannedDeparture: string;
  actualDeparture: string;
  plannedArrival: string;
  actualArrival: string;
  estimatedCost: number;
  actualCost: number;
  progress: number;
}

const mockTrips: Trip[] = [
  {
    id: "1",
    tripNo: "TRIP-2024-001",
    orderIds: ["ORD-2024-001", "ORD-2024-002"],
    vehicleRegistration: "TRUCK-101",
    driverName: "John Doe",
    status: "IN_TRANSIT",
    priority: "HIGH",
    origin: "New York",
    destination: "Boston",
    distance: 320,
    estimatedHours: 6,
    plannedDeparture: "2024-01-15 08:00",
    actualDeparture: "2024-01-15 08:30",
    plannedArrival: "2024-01-15 14:00",
    actualArrival: "",
    estimatedCost: 1200,
    actualCost: 0,
    progress: 65,
  },
  {
    id: "2",
    tripNo: "TRIP-2024-002",
    orderIds: ["ORD-2024-003"],
    vehicleRegistration: "VAN-205",
    driverName: "Jane Smith",
    status: "DISPATCHED",
    priority: "NORMAL",
    origin: "Los Angeles",
    destination: "San Francisco",
    distance: 620,
    estimatedHours: 8,
    plannedDeparture: "2024-01-14 10:00",
    actualDeparture: "2024-01-14 10:15",
    plannedArrival: "2024-01-14 18:00",
    actualArrival: "",
    estimatedCost: 800,
    actualCost: 0,
    progress: 25,
  },
  {
    id: "3",
    tripNo: "TRIP-2024-003",
    orderIds: ["ORD-2024-004"],
    vehicleRegistration: "TRUCK-309",
    driverName: "Mike Johnson",
    status: "DELIVERED",
    priority: "NORMAL",
    origin: "Chicago",
    destination: "Detroit",
    distance: 450,
    estimatedHours: 7,
    plannedDeparture: "2024-01-13 09:00",
    actualDeparture: "2024-01-13 09:00",
    plannedArrival: "2024-01-13 16:00",
    actualArrival: "2024-01-13 15:45",
    estimatedCost: 950,
    actualCost: 980,
    progress: 100,
  },
];

const tripStatuses = ["PLANNED", "DISPATCHED", "IN_TRANSIT", "DELIVERED", "COMPLETED", "CANCELLED"];
const priorities = ["LOW", "NORMAL", "HIGH", "URGENT"];

export default function TripsPage() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const [formData, setFormData] = useState({
    tripNo: "",
    orderIds: "",
    vehicleRegistration: "",
    driverName: "",
    status: "PLANNED",
    priority: "NORMAL",
    origin: "",
    destination: "",
    distance: 0,
    estimatedHours: 0,
    plannedDeparture: "",
    plannedArrival: "",
    estimatedCost: 0,
  });

  const filteredTrips = trips.filter(
    (trip) =>
      trip.tripNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.vehicleRegistration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      tripNo: "",
      orderIds: "",
      vehicleRegistration: "",
      driverName: "",
      status: "PLANNED",
      priority: "NORMAL",
      origin: "",
      destination: "",
      distance: 0,
      estimatedHours: 0,
      plannedDeparture: "",
      plannedArrival: "",
      estimatedCost: 0,
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newTrip: Trip = {
      id: Date.now().toString(),
      tripNo: formData.tripNo,
      orderIds: formData.orderIds.split(",").map(id => id.trim()),
      vehicleRegistration: formData.vehicleRegistration,
      driverName: formData.driverName,
      status: formData.status,
      priority: formData.priority,
      origin: formData.origin,
      destination: formData.destination,
      distance: formData.distance,
      estimatedHours: formData.estimatedHours,
      plannedDeparture: formData.plannedDeparture,
      actualDeparture: "",
      plannedArrival: formData.plannedArrival,
      actualArrival: "",
      estimatedCost: formData.estimatedCost,
      actualCost: 0,
      progress: 0,
    };
    setTrips([...trips, newTrip]);
    setIsCreateDialogOpen(false);
    resetForm();
    setIsLoading(false);
    toast({ title: "Trip Created", description: "New trip has been scheduled." });
  };

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
    setFormData({
      tripNo: trip.tripNo,
      orderIds: trip.orderIds.join(", "),
      vehicleRegistration: trip.vehicleRegistration,
      driverName: trip.driverName,
      status: trip.status,
      priority: trip.priority,
      origin: trip.origin,
      destination: trip.destination,
      distance: trip.distance,
      estimatedHours: trip.estimatedHours,
      plannedDeparture: trip.plannedDeparture,
      plannedArrival: trip.plannedArrival,
      estimatedCost: trip.estimatedCost,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedTrip) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setTrips(
      trips.map((t) =>
        t.id === selectedTrip.id
          ? {
            ...t,
            tripNo: formData.tripNo,
            orderIds: formData.orderIds.split(",").map(id => id.trim()),
            vehicleRegistration: formData.vehicleRegistration,
            driverName: formData.driverName,
            status: formData.status,
            priority: formData.priority,
            origin: formData.origin,
            destination: formData.destination,
            distance: formData.distance,
            estimatedHours: formData.estimatedHours,
            plannedDeparture: formData.plannedDeparture,
            plannedArrival: formData.plannedArrival,
            estimatedCost: formData.estimatedCost,
          }
          : t
      )
    );
    setIsEditDialogOpen(false);
    setSelectedTrip(null);
    setIsLoading(false);
    toast({ title: "Trip Updated", description: "Trip details have been saved." });
  };

  const handleView = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTrip) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setTrips(trips.filter((t) => t.id !== selectedTrip.id));
    setIsDeleteDialogOpen(false);
    setSelectedTrip(null);
    setIsLoading(false);
    toast({ title: "Trip Deleted", description: "The trip has been removed.", variant: "destructive" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNED": return "secondary";
      case "DISPATCHED": return "default";
      case "IN_TRANSIT": return "secondary";
      case "DELIVERED": return "default";
      case "COMPLETED": return "default";
      case "CANCELLED": return "destructive";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "destructive";
      case "HIGH": return "secondary";
      case "NORMAL": return "default";
      case "LOW": return "outline";
      default: return "outline";
    }
  };

  const TripForm = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid items-center gap-2">
          <Label htmlFor="tripNo">Trip No</Label>
          <Input
            id="tripNo"
            value={formData.tripNo}
            onChange={(e) => setFormData({ ...formData, tripNo: e.target.value })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid items-center gap-2">
        <Label htmlFor="orderIds">Order IDs (comma separated)</Label>
        <Input
          id="orderIds"
          placeholder="ORD-001, ORD-002"
          value={formData.orderIds}
          onChange={(e) => setFormData({ ...formData, orderIds: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid items-center gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {tripStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="vehicleRegistration">Vehicle</Label>
          <Input
            id="vehicleRegistration"
            value={formData.vehicleRegistration}
            onChange={(e) => setFormData({ ...formData, vehicleRegistration: e.target.value })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="driverName">Driver</Label>
          <Input
            id="driverName"
            value={formData.driverName}
            onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid items-center gap-2">
          <Label htmlFor="origin">Origin</Label>
          <Input
            id="origin"
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid items-center gap-2">
          <Label htmlFor="distance">Distance (km)</Label>
          <Input
            id="distance"
            type="number"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="estimatedHours">Est. Hours</Label>
          <Input
            id="estimatedHours"
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="estimatedCost">Est. Cost ($)</Label>
          <Input
            id="estimatedCost"
            type="number"
            value={formData.estimatedCost}
            onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid items-center gap-2">
          <Label htmlFor="plannedDeparture">Planned Departure</Label>
          <Input
            id="plannedDeparture"
            type="datetime-local"
            value={formData.plannedDeparture}
            onChange={(e) => setFormData({ ...formData, plannedDeparture: e.target.value })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="plannedArrival">Planned Arrival</Label>
          <Input
            id="plannedArrival"
            type="datetime-local"
            value={formData.plannedArrival}
            onChange={(e) => setFormData({ ...formData, plannedArrival: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
          <p className="text-gray-600">Manage your transportation trips and routes</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          New Trip
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Trips</CardTitle>
          <CardDescription>
            Manage your transportation trips, track progress, and monitor costs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip No</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Vehicle/Driver</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.tripNo}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {trip.orderIds.map((orderId, index) => (
                        <div key={index} className="text-blue-600 hover:underline cursor-pointer font-xs">
                          {orderId}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{trip.vehicleRegistration}</div>
                      <div className="text-gray-500 text-xs">{trip.driverName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {trip.origin}
                      </div>
                      <div className="text-gray-500 pl-4">↓</div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {trip.destination}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(trip.status)}>
                      {trip.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(trip.priority)}>
                      {trip.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-20">
                      <Progress value={trip.progress} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1 center">{trip.progress}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div className="flex items-center" title="Planned Departure">
                        <Clock className="h-3 w-3 mr-1" />
                        {trip.plannedDeparture.split(' ')[0]}
                      </div>
                      <div className="text-gray-500 pl-4">↓</div>
                      <div className="flex items-center" title="Planned Arrival">
                        <Clock className="h-3 w-3 mr-1" />
                        {trip.plannedArrival.split(' ')[0]}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>${trip.estimatedCost}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleView(trip)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(trip)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(trip)} className="text-red-600">
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

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
            <DialogDescription>
              Create a new transportation trip. Assign vehicle and driver.
            </DialogDescription>
          </DialogHeader>
          <TripForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
            <DialogDescription>
              Update trip information. Make sure to save your changes.
            </DialogDescription>
          </DialogHeader>
          <TripForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
            <DialogDescription>{selectedTrip?.tripNo}</DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant={getStatusColor(selectedTrip.status)}>{selectedTrip.status}</Badge>
                      <Badge variant={getPriorityColor(selectedTrip.priority)}>{selectedTrip.priority}</Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Progress: {selectedTrip.progress}%</div>
                    <Progress value={selectedTrip.progress} className="h-1 mt-1" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${selectedTrip.estimatedCost}</div>
                    <div className="text-xs text-muted-foreground">Estimated</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs text-muted-foreground">Vehicle Information</Label>
                  <div className="font-medium">{selectedTrip.vehicleRegistration}</div>
                  <div className="text-sm text-gray-500">{selectedTrip.driverName}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Metric</Label>
                  <div className="font-medium">{selectedTrip.distance} km</div>
                  <div className="text-sm text-gray-500">{selectedTrip.estimatedHours} hrs est.</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-xs text-muted-foreground mb-2 block">Route Timeline</Label>
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-2">
                  <div className="mb-8 ml-6 relative">
                    <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white">
                      <MapPin className="h-3 w-3 text-blue-600" />
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">{selectedTrip.origin}</h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-gray-400">{selectedTrip.plannedDeparture}</time>
                  </div>
                  <div className="ml-6 relative">
                    <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-green-100 ring-4 ring-white">
                      <MapPin className="h-3 w-3 text-green-600" />
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">{selectedTrip.destination}</h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-gray-400">{selectedTrip.plannedArrival}</time>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Orders</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedTrip.orderIds.map(id => (
                    <Badge key={id} variant="outline" className="font-mono text-xs">{id}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedTrip) handleEdit(selectedTrip); }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
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
              This will permanently delete trip <strong>{selectedTrip?.tripNo}</strong>.
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