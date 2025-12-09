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
import { Plus, Search, Edit, Trash2, Eye, Wrench } from "lucide-react";

interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  vehicleType: string;
  capacityWeight: number;
  capacityVolume: number;
  isActive: boolean;
  fitnessExpiry: string;
  insuranceExpiry: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    registration: "TRUCK-101",
    make: "Volvo",
    model: "FH16",
    year: 2022,
    vehicleType: "Heavy Truck",
    capacityWeight: 25000,
    capacityVolume: 50,
    isActive: true,
    fitnessExpiry: "2024-12-31",
    insuranceExpiry: "2024-06-30",
  },
  {
    id: "2",
    registration: "VAN-205",
    make: "Ford",
    model: "Transit",
    year: 2023,
    vehicleType: "Light Van",
    capacityWeight: 3500,
    capacityVolume: 15,
    isActive: true,
    fitnessExpiry: "2024-10-15",
    insuranceExpiry: "2024-08-20",
  },
  {
    id: "3",
    registration: "TRUCK-309",
    make: "Mercedes",
    model: "Actros",
    year: 2021,
    vehicleType: "Heavy Truck",
    capacityWeight: 28000,
    capacityVolume: 55,
    isActive: false,
    fitnessExpiry: "2024-03-01",
    insuranceExpiry: "2024-02-28",
  },
];

const vehicleTypes = [
  "Light Van",
  "Medium Truck",
  "Heavy Truck",
  "Trailer",
  "Container Truck",
  "Refrigerated Truck",
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    registration: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    vehicleType: "",
    capacityWeight: 0,
    capacityVolume: 0,
    fitnessExpiry: "",
    insuranceExpiry: "",
  });

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      ...formData,
      isActive: true,
    };
    setVehicles([...vehicles, newVehicle]);
    setIsCreateDialogOpen(false);
    setFormData({
      registration: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      vehicleType: "",
      capacityWeight: 0,
      capacityVolume: 0,
      fitnessExpiry: "",
      insuranceExpiry: "",
    });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      registration: vehicle.registration,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vehicleType: vehicle.vehicleType,
      capacityWeight: vehicle.capacityWeight,
      capacityVolume: vehicle.capacityVolume,
      fitnessExpiry: vehicle.fitnessExpiry,
      insuranceExpiry: vehicle.insuranceExpiry,
    });
  };

  const handleUpdate = () => {
    if (editingVehicle) {
      setVehicles(
        vehicles.map((v) =>
          v.id === editingVehicle.id
            ? { ...v, ...formData }
            : v
        )
      );
      setEditingVehicle(null);
      setFormData({
        registration: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vehicleType: "",
        capacityWeight: 0,
        capacityVolume: 0,
        fitnessExpiry: "",
        insuranceExpiry: "",
      });
    }
  };

  const handleDelete = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600">Manage your vehicle fleet</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Create a new vehicle record. Fill in the required information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="registration" className="text-right">
                  Registration
                </Label>
                <Input
                  id="registration"
                  value={formData.registration}
                  onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="make" className="text-right">
                  Make
                </Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">
                  Model
                </Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">
                  Year
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicleType" className="text-right">
                  Type
                </Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacityWeight" className="text-right">
                  Weight Capacity (kg)
                </Label>
                <Input
                  id="capacityWeight"
                  type="number"
                  value={formData.capacityWeight}
                  onChange={(e) => setFormData({ ...formData, capacityWeight: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacityVolume" className="text-right">
                  Volume Capacity (m³)
                </Label>
                <Input
                  id="capacityVolume"
                  type="number"
                  value={formData.capacityVolume}
                  onChange={(e) => setFormData({ ...formData, capacityVolume: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fitnessExpiry" className="text-right">
                  Fitness Expiry
                </Label>
                <Input
                  id="fitnessExpiry"
                  type="date"
                  value={formData.fitnessExpiry}
                  onChange={(e) => setFormData({ ...formData, fitnessExpiry: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="insuranceExpiry" className="text-right">
                  Insurance Expiry
                </Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreate}>
                Create Vehicle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Fleet</CardTitle>
          <CardDescription>
            A list of all vehicles in your fleet including their specifications and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration</TableHead>
                <TableHead>Make/Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Fitness</TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.registration}</TableCell>
                  <TableCell>{`${vehicle.make} ${vehicle.model}`}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.vehicleType}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{vehicle.capacityWeight.toLocaleString()} kg</div>
                      <div className="text-gray-500">{vehicle.capacityVolume} m³</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        isExpired(vehicle.fitnessExpiry)
                          ? "destructive"
                          : isExpiringSoon(vehicle.fitnessExpiry)
                          ? "secondary"
                          : "default"
                      }
                    >
                      {vehicle.fitnessExpiry}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        isExpired(vehicle.insuranceExpiry)
                          ? "destructive"
                          : isExpiringSoon(vehicle.insuranceExpiry)
                          ? "secondary"
                          : "default"
                      }
                    >
                      {vehicle.insuranceExpiry}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                      {vehicle.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(vehicle)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Wrench className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(vehicle.id)}>
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
      <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update vehicle information. Make sure to save your changes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-registration" className="text-right">
                Registration
              </Label>
              <Input
                id="edit-registration"
                value={formData.registration}
                onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-make" className="text-right">
                Make
              </Label>
              <Input
                id="edit-make"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-model" className="text-right">
                Model
              </Label>
              <Input
                id="edit-model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-year" className="text-right">
                Year
              </Label>
              <Input
                id="edit-year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-vehicleType" className="text-right">
                Type
              </Label>
              <Select
                value={formData.vehicleType}
                onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-capacityWeight" className="text-right">
                Weight Capacity (kg)
              </Label>
              <Input
                id="edit-capacityWeight"
                type="number"
                value={formData.capacityWeight}
                onChange={(e) => setFormData({ ...formData, capacityWeight: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-capacityVolume" className="text-right">
                Volume Capacity (m³)
              </Label>
              <Input
                id="edit-capacityVolume"
                type="number"
                value={formData.capacityVolume}
                onChange={(e) => setFormData({ ...formData, capacityVolume: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-fitnessExpiry" className="text-right">
                Fitness Expiry
              </Label>
              <Input
                id="edit-fitnessExpiry"
                type="date"
                value={formData.fitnessExpiry}
                onChange={(e) => setFormData({ ...formData, fitnessExpiry: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-insuranceExpiry" className="text-right">
                Insurance Expiry
              </Label>
              <Input
                id="edit-insuranceExpiry"
                type="date"
                value={formData.insuranceExpiry}
                onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdate}>
              Update Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}