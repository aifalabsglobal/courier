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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Edit, Trash2, Eye, Truck, MapPin, Clock } from "lucide-react";

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
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
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

  const handleCreate = () => {
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
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
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
  };

  const handleUpdate = () => {
    if (editingTrip) {
      setTrips(
        trips.map((t) =>
          t.id === editingTrip.id
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
      setEditingTrip(null);
      resetForm();
    }
  };

  const handleDelete = (id: string) => {
    setTrips(trips.filter((t) => t.id !== id));
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNED":
        return "secondary";
      case "DISPATCHED":
        return "default";
      case "IN_TRANSIT":
        return "secondary";
      case "DELIVERED":
        return "default";
      case "COMPLETED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "destructive";
      case "HIGH":
        return "secondary";
      case "NORMAL":
        return "default";
      case "LOW":
        return "outline";
      default:
        return "outline";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
          <p className="text-gray-600">Manage your transportation trips and routes</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Trip</DialogTitle>
              <DialogDescription>
                Create a new transportation trip. Assign vehicle and driver.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
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
            <DialogFooter>
              <Button type="submit" onClick={handleCreate}>
                Create Trip
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                        <div key={index} className="text-blue-600 hover:underline cursor-pointer">
                          {orderId}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{trip.vehicleRegistration}</div>
                      <div className="text-gray-500">{trip.driverName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {trip.origin}
                      </div>
                      <div className="text-gray-500">→ {trip.destination}</div>
                      <div className="text-gray-400">{trip.distance} km</div>
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
                      <div className="text-xs text-gray-500 mt-1">{trip.progress}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {trip.plannedDeparture}
                      </div>
                      <div className="text-gray-500">→ {trip.plannedArrival}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Est: ${trip.estimatedCost}</div>
                      {trip.actualCost > 0 && (
                        <div className="text-gray-500">Act: ${trip.actualCost}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(trip)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(trip.id)}>
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
      <Dialog open={!!editingTrip} onOpenChange={() => setEditingTrip(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
            <DialogDescription>
              Update trip information. Make sure to save your changes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid items-center gap-2">
                <Label htmlFor="edit-tripNo">Trip No</Label>
                <Input
                  id="edit-tripNo"
                  value={formData.tripNo}
                  onChange={(e) => setFormData({ ...formData, tripNo: e.target.value })}
                />
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="edit-status">Status</Label>
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
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="edit-orderIds">Order IDs (comma separated)</Label>
              <Input
                id="edit-orderIds"
                value={formData.orderIds}
                onChange={(e) => setFormData({ ...formData, orderIds: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdate}>
              Update Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}