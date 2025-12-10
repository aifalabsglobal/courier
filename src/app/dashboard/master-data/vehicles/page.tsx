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
import { Plus, Search, Edit, Trash2, Eye, Wrench, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

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

  const resetForm = () => {
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

  const handleCreate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      ...formData,
      isActive: true,
    };
    setVehicles([...vehicles, newVehicle]);
    setIsCreateDialogOpen(false);
    resetForm();
    setIsLoading(false);
    toast({ title: "Vehicle Registered", description: "New vehicle added to master data." });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
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
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedVehicle) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setVehicles(
      vehicles.map((v) =>
        v.id === selectedVehicle.id
          ? { ...v, ...formData }
          : v
      )
    );
    setIsEditDialogOpen(false);
    setSelectedVehicle(null);
    setIsLoading(false);
    toast({ title: "Vehicle Updated", description: "Vehicle details saved." });
  };

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setVehicles(vehicles.filter((v) => v.id !== selectedVehicle.id));
    setIsDeleteDialogOpen(false);
    setSelectedVehicle(null);
    setIsLoading(false);
    toast({ title: "Vehicle Deleted", description: "Vehicle removed from master data.", variant: "destructive" });
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

  const VehicleForm = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="registration" className="text-right">Registration</Label>
        <Input
          id="registration"
          value={formData.registration}
          onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="make" className="text-right">Make</Label>
        <Input
          id="make"
          value={formData.make}
          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="model" className="text-right">Model</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="year" className="text-right">Year</Label>
        <Input
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="vehicleType" className="text-right">Type</Label>
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
        <Label htmlFor="capacityWeight" className="text-right">Weight (kg)</Label>
        <Input
          id="capacityWeight"
          type="number"
          value={formData.capacityWeight}
          onChange={(e) => setFormData({ ...formData, capacityWeight: parseFloat(e.target.value) })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="capacityVolume" className="text-right">Volume (m³)</Label>
        <Input
          id="capacityVolume"
          type="number"
          value={formData.capacityVolume}
          onChange={(e) => setFormData({ ...formData, capacityVolume: parseFloat(e.target.value) })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fitnessExpiry" className="text-right">Fitness Exp.</Label>
        <Input
          id="fitnessExpiry"
          type="date"
          value={formData.fitnessExpiry}
          onChange={(e) => setFormData({ ...formData, fitnessExpiry: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="insuranceExpiry" className="text-right">Ins. Exp.</Label>
        <Input
          id="insuranceExpiry"
          type="date"
          value={formData.insuranceExpiry}
          onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
          className="col-span-3"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600">Master data registry for vehicle fleet</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Registry</CardTitle>
          <CardDescription>
            A list of all vehicles in your fleet including their specifications.
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
                            : "outline"
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
                            : "outline"
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
                      <Button variant="ghost" size="sm" onClick={() => handleView(vehicle)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(vehicle)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(vehicle)} className="text-red-600">
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Create a new vehicle record in master data.
            </DialogDescription>
          </DialogHeader>
          <VehicleForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update vehicle information.
            </DialogDescription>
          </DialogHeader>
          <VehicleForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
            <DialogDescription>{selectedVehicle?.registration}</DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Make / Model</Label>
                  <div className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Year</Label>
                  <div className="font-medium">{selectedVehicle.year}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Type</Label>
                  <div className="font-medium">{selectedVehicle.vehicleType}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <Badge variant={selectedVehicle.isActive ? "default" : "secondary"}>{selectedVehicle.isActive ? "Active" : "Inactive"}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Capacity (Weight)</Label>
                  <div className="font-medium">{selectedVehicle.capacityWeight} kg</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Capacity (Volume)</Label>
                  <div className="font-medium">{selectedVehicle.capacityVolume} m³</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Fitness Expiry</Label>
                  <div className="font-medium text-sm">{selectedVehicle.fitnessExpiry}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Insurance Expiry</Label>
                  <div className="font-medium text-sm">{selectedVehicle.insuranceExpiry}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedVehicle) handleEdit(selectedVehicle); }}>
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
              This will permanently delete <strong>{selectedVehicle?.registration}</strong> from the registry.
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