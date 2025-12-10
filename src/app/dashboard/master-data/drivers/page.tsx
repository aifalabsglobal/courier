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
import { Plus, Search, Edit, Trash2, Eye, Star, User, Loader2, Calendar, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Driver {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  licenseNo: string;
  licenseExpiry: string;
  rating: number;
  isActive: boolean;
}

const mockDrivers: Driver[] = [
  {
    id: "1",
    code: "DRV001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1-555-0101",
    licenseNo: "DL123456",
    licenseExpiry: "2024-12-31",
    rating: 4.5,
    isActive: true,
  },
  {
    id: "2",
    code: "DRV002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1-555-0102",
    licenseNo: "DL789012",
    licenseExpiry: "2024-08-15",
    rating: 4.8,
    isActive: true,
  },
  {
    id: "3",
    code: "DRV003",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1-555-0103",
    licenseNo: "DL345678",
    licenseExpiry: "2024-03-01",
    rating: 3.9,
    isActive: false,
  },
];

export default function DriversPage() {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selected driver
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    email: "",
    phone: "",
    licenseNo: "",
    licenseExpiry: "",
    rating: 5.0,
    isActive: true
  });

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      code: `DRV${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: "",
      email: "",
      phone: "",
      licenseNo: "",
      licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rating: 5.0,
      isActive: true
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newDriver: Driver = {
      id: Date.now().toString(),
      ...formData,
    };
    setDrivers([...drivers, newDriver]);
    setIsCreateDialogOpen(false);
    resetForm();
    setIsLoading(false);
    toast({ title: "Driver Added", description: `${formData.name} has been added to the system.` });
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData({
      code: driver.code,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      licenseNo: driver.licenseNo,
      licenseExpiry: driver.licenseExpiry,
      rating: driver.rating,
      isActive: driver.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedDriver) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setDrivers(
      drivers.map((d) =>
        d.id === selectedDriver.id
          ? { ...d, ...formData }
          : d
      )
    );
    setIsEditDialogOpen(false);
    setSelectedDriver(null);
    setIsLoading(false);
    toast({ title: "Driver Updated", description: "Driver details have been updated." });
  };

  const handleView = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDriver) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setDrivers(drivers.filter((d) => d.id !== selectedDriver.id));
    setIsDeleteDialogOpen(false);
    setSelectedDriver(null);
    setIsLoading(false);
    toast({ title: "Driver Deleted", description: "Driver has been removed.", variant: "destructive" });
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

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const stats = {
    total: drivers.length,
    active: drivers.filter(d => d.isActive).length,
    expiredLicense: drivers.filter(d => isExpired(d.licenseExpiry)).length
  };

  const DriverForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Code</Label>
        <Input
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Phone</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">License No</Label>
        <Input
          value={formData.licenseNo}
          onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Expiry</Label>
        <Input
          type="date"
          value={formData.licenseExpiry}
          onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Rating</Label>
        <Input
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
          className="col-span-3"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-600">Manage your driver database</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Add Driver
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <User className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{stats.active}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Licenses</CardTitle>
            <User className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{stats.expiredLicense}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Driver List</CardTitle>
          <CardDescription>
            A list of all drivers in your system including their details and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search drivers..."
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
                <TableHead>Contact</TableHead>
                <TableHead>License No</TableHead>
                <TableHead>License Expiry</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.code}</TableCell>
                  <TableCell>{driver.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{driver.email}</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{driver.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{driver.licenseNo}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        isExpired(driver.licenseExpiry)
                          ? "destructive"
                          : isExpiringSoon(driver.licenseExpiry)
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {driver.licenseExpiry}
                    </Badge>
                  </TableCell>
                  <TableCell>{renderRating(driver.rating)}</TableCell>
                  <TableCell>
                    <Badge variant={driver.isActive ? "default" : "secondary"}>
                      {driver.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleView(driver)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(driver)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(driver)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>Create a new driver record.</DialogDescription>
          </DialogHeader>
          <DriverForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Update driver information.</DialogDescription>
          </DialogHeader>
          <DriverForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>Full information for {selectedDriver?.code}</DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Name</Label>
                  <div className="font-medium">{selectedDriver.name}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <div className="font-medium">{selectedDriver.email}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <div className="font-medium">{selectedDriver.phone}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Rating</Label>
                  <div className="font-medium flex items-center gap-1">{selectedDriver.rating} <Star className="h-3 w-3 fill-current text-yellow-500" /></div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">License No</Label>
                  <div className="font-medium">{selectedDriver.licenseNo}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">License Expiry</Label>
                  <div className={`font-medium ${isExpired(selectedDriver.licenseExpiry) ? "text-red-500" : ""}`}>
                    {selectedDriver.licenseExpiry}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <Badge className="mt-1" variant={selectedDriver.isActive ? "default" : "secondary"}>
                    {selectedDriver.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedDriver) handleEdit(selectedDriver); }}>
              <Edit className="h-4 w-4 mr-2" />Edit
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
              This will permanently delete <strong>{selectedDriver?.name}</strong>.
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