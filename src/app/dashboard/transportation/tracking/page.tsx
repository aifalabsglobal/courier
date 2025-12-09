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
import { Plus, Search, MapPin, Clock, Package, Truck, AlertTriangle } from "lucide-react";

interface TrackingEvent {
  id: string;
  orderId?: string;
  tripId?: string;
  eventType: string;
  location: string;
  description: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  createdBy?: string;
}

const mockTrackingEvents: TrackingEvent[] = [
  {
    id: "1",
    orderId: "ORD-2024-001",
    tripId: "TRIP-2024-001",
    eventType: "DEPARTED",
    location: "New York, NY",
    description: "Vehicle departed from origin facility",
    timestamp: "2024-01-15 08:30:00",
    latitude: 40.7128,
    longitude: -74.0060,
    createdBy: "John Doe",
  },
  {
    id: "2",
    orderId: "ORD-2024-001",
    tripId: "TRIP-2024-001",
    eventType: "LOADED",
    location: "New York, NY",
    description: "Cargo loaded successfully",
    timestamp: "2024-01-15 08:15:00",
    createdBy: "John Doe",
  },
  {
    id: "3",
    orderId: "ORD-2024-002",
    tripId: "TRIP-2024-002",
    eventType: "DISPATCHED",
    location: "Los Angeles, CA",
    description: "Trip dispatched to driver",
    timestamp: "2024-01-14 10:15:00",
    createdBy: "System",
  },
  {
    id: "4",
    orderId: "ORD-2024-003",
    tripId: "TRIP-2024-003",
    eventType: "DELIVERED",
    location: "Detroit, MI",
    description: "Cargo delivered to consignee",
    timestamp: "2024-01-13 15:45:00",
    latitude: 42.3314,
    longitude: -83.0458,
    createdBy: "Mike Johnson",
  },
  {
    id: "5",
    orderId: "ORD-2024-001",
    tripId: "TRIP-2024-001",
    eventType: "DELAYED",
    location: "Hartford, CT",
    description: "Traffic delay estimated 30 minutes",
    timestamp: "2024-01-15 11:20:00",
    createdBy: "John Doe",
  },
];

const eventTypes = [
  "DEPARTED",
  "ARRIVED", 
  "LOADED",
  "UNLOADED",
  "DISPATCHED",
  "DELAYED",
  "BREAKDOWN",
  "DELIVERED",
  "CANCELLED",
];

export default function TrackingPage() {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>(mockTrackingEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    orderId: "",
    tripId: "",
    eventType: "",
    location: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const filteredEvents = trackingEvents.filter(
    (event) =>
      event.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tripId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newEvent: TrackingEvent = {
      id: Date.now().toString(),
      orderId: formData.orderId || undefined,
      tripId: formData.tripId || undefined,
      eventType: formData.eventType,
      location: formData.location,
      description: formData.description,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      createdBy: "Current User",
    };
    setTrackingEvents([newEvent, ...trackingEvents]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      orderId: "",
      tripId: "",
      eventType: "",
      location: "",
      description: "",
      latitude: "",
      longitude: "",
    });
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "DEPARTED":
      case "ARRIVED":
        return <Truck className="h-4 w-4" />;
      case "LOADED":
      case "UNLOADED":
        return <Package className="h-4 w-4" />;
      case "DELAYED":
      case "BREAKDOWN":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "DEPARTED":
        return "default";
      case "ARRIVED":
        return "default";
      case "LOADED":
        return "secondary";
      case "UNLOADED":
        return "secondary";
      case "DELIVERED":
        return "default";
      case "DELAYED":
        return "secondary";
      case "BREAKDOWN":
        return "destructive";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tracking</h1>
          <p className="text-gray-600">Real-time tracking and event management</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Tracking Event</DialogTitle>
              <DialogDescription>
                Record a new tracking event for an order or trip.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    placeholder="ORD-2024-001"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="tripId">Trip ID</Label>
                  <Input
                    id="tripId"
                    placeholder="TRIP-2024-001"
                    value={formData.tripId}
                    onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Event description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="latitude">Latitude (optional)</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="40.7128"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="longitude">Longitude (optional)</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="-74.0060"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreate}>
                Add Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Tracking Events</CardTitle>
            <CardDescription>
              Latest tracking updates across all orders and trips.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      {getEventTypeIcon(event.eventType)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getEventTypeColor(event.eventType)}>
                          {event.eventType}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {event.orderId || event.tripId}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatTimestamp(event.timestamp)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                      {event.createdBy && (
                        <div>By: {event.createdBy}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Trips Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Active Trips</CardTitle>
            <CardDescription>
              Currently active transportation trips.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">TRIP-2024-001</div>
                    <div className="text-sm text-gray-500">New York → Boston</div>
                  </div>
                  <Badge variant="secondary">In Transit</Badge>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Last update: 2 hours ago
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">TRIP-2024-002</div>
                    <div className="text-sm text-gray-500">Los Angeles → San Francisco</div>
                  </div>
                  <Badge variant="outline">Dispatched</Badge>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Last update: 4 hours ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tracking Events</CardTitle>
          <CardDescription>
            Complete history of all tracking events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Order/Trip</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="text-sm">
                    {formatTimestamp(event.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getEventTypeColor(event.eventType)}>
                        {event.eventType}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {event.orderId && <div>{event.orderId}</div>}
                      {event.tripId && <div className="text-gray-500">{event.tripId}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                  <TableCell>
                    {event.latitude && event.longitude ? (
                      <div className="text-sm">
                        <div>{event.latitude.toFixed(4)}</div>
                        <div>{event.longitude.toFixed(4)}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{event.createdBy || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}