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
import { Plus, Search, Edit, Trash2, Eye, Wrench, AlertTriangle, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Maintenance {
  id: string;
  vehicleId: string;
  vehicleRegistration: string;
  type: string;
  description: string;
  cost: number;
  odometer: number;
  performedBy: string;
  performedAt: string;
  nextDueAt: string;
  status: string;
  notes: string;
}

const mockMaintenance: Maintenance[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicleRegistration: "TRUCK-101",
    type: "PREVENTIVE",
    description: "Regular oil change and filter replacement",
    cost: 150,
    odometer: 45000,
    performedBy: "Quick Lube Service",
    performedAt: "2024-01-10",
    nextDueAt: "2024-04-10",
    status: "COMPLETED",
    notes: "Oil replaced with synthetic 5W-30",
  },
  {
    id: "2",
    vehicleId: "2",
    vehicleRegistration: "VAN-205",
    type: "CORRECTIVE",
    description: "Brake pad replacement",
    cost: 350,
    odometer: 32000,
    performedBy: "Auto Repair Shop",
    performedAt: "2024-01-08",
    nextDueAt: "",
    status: "COMPLETED",
    notes: "Front brake pads replaced, rotors resurfaced",
  },
  {
    id: "3",
    vehicleId: "3",
    vehicleRegistration: "TRUCK-309",
    type: "PREVENTIVE",
    description: "Tire rotation and alignment",
    cost: 0,
    odometer: 0,
    performedBy: "",
    performedAt: "",
    nextDueAt: "2024-02-15",
    status: "SCHEDULED",
    notes: "Regular preventive maintenance",
  },
  {
    id: "4",
    vehicleId: "1",
    vehicleRegistration: "TRUCK-101",
    type: "EMERGENCY",
    description: "Engine overheating issue",
    cost: 800,
    odometer: 44500,
    performedBy: "Emergency Road Service",
    performedAt: "2024-01-05",
    nextDueAt: "",
    status: "COMPLETED",
    notes: "Radiator hose replaced, coolant flushed",
  },
];

const maintenanceTypes = ["PREVENTIVE", "CORRECTIVE", "EMERGENCY"];
const maintenanceStatuses = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function MaintenancePage() {
  const { toast } = useToast();
  const [maintenance, setMaintenance] = useState<Maintenance[]>(mockMaintenance);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<Maintenance | null>(null);

  const [formData, setFormData] = useState({
    vehicleRegistration: "",
    type: "PREVENTIVE",
    description: "",
    cost: 0,
    odometer: 0,
    performedBy: "",
    performedAt: "",
    nextDueAt: "",
    status: "SCHEDULED",
    notes: "",
  });

  const filteredMaintenance = maintenance.filter(
    (item) =>
      item.vehicleRegistration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      vehicleRegistration: "",
      type: "PREVENTIVE",
      description: "",
      cost: 0,
      odometer: 0,
      performedBy: "",
      performedAt: "",
      nextDueAt: "",
      status: "SCHEDULED",
      notes: "",
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newMaintenance: Maintenance = {
      id: Date.now().toString(),
      vehicleId: Date.now().toString(),
      vehicleRegistration: formData.vehicleRegistration,
      type: formData.type,
      description: formData.description,
      cost: formData.cost,
      odometer: formData.odometer,
      performedBy: formData.performedBy,
      performedAt: formData.performedAt,
      nextDueAt: formData.nextDueAt,
      status: formData.status,
      notes: formData.notes,
    };
    setMaintenance([...maintenance, newMaintenance]);
    setIsCreateDialogOpen(false);
    resetForm();
    setIsLoading(false);
    toast({ title: "Maintenance Scheduled", description: "Service record created successfully." });
  };

  const handleEdit = (item: Maintenance) => {
    setSelectedRecord(item);
    setFormData({
      vehicleRegistration: item.vehicleRegistration,
      type: item.type,
      description: item.description,
      cost: item.cost,
      odometer: item.odometer,
      performedBy: item.performedBy,
      performedAt: item.performedAt,
      nextDueAt: item.nextDueAt,
      status: item.status,
      notes: item.notes,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedRecord) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setMaintenance(
      maintenance.map((item) =>
        item.id === selectedRecord.id
          ? { ...item, ...formData }
          : item
      )
    );
    setIsEditDialogOpen(false);
    setSelectedRecord(null);
    setIsLoading(false);
    toast({ title: "Record Updated", description: "Maintenance details updated." });
  };

  const handleDeleteClick = (item: Maintenance) => {
    setSelectedRecord(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMaintenance(maintenance.filter((item) => item.id !== selectedRecord.id));
    setIsDeleteDialogOpen(false);
    setSelectedRecord(null);
    setIsLoading(false);
    toast({ title: "Record Deleted", description: "Maintenance record removed.", variant: "destructive" });
  };

  const handleView = (item: Maintenance) => {
    setSelectedRecord(item);
    setIsViewDialogOpen(true);
  };

  const handleComplete = async (id: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setMaintenance(
      maintenance.map((item) =>
        item.id === id
          ? { ...item, status: "COMPLETED", performedAt: new Date().toISOString().split('T')[0] }
          : item
      )
    );
    setIsLoading(false);
    toast({ title: "Status Updated", description: "Maintenance marked as completed." });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "default";
      case "IN_PROGRESS": return "secondary";
      case "SCHEDULED": return "outline";
      case "CANCELLED": return "destructive";
      default: return "outline";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PREVENTIVE": return "default";
      case "CORRECTIVE": return "secondary";
      case "EMERGENCY": return "destructive";
      default: return "outline";
    }
  };

  const isOverdue = (nextDueAt: string) => {
    if (!nextDueAt) return false;
    const due = new Date(nextDueAt);
    const today = new Date();
    return due < today;
  };

  const isDueSoon = (nextDueAt: string) => {
    if (!nextDueAt) return false;
    const due = new Date(nextDueAt);
    const today = new Date();
    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue > 0;
  };

  const totalCost = maintenance
    .filter(item => item.status === "COMPLETED")
    .reduce((sum, item) => sum + item.cost, 0);

  const scheduledCount = maintenance.filter(item => item.status === "SCHEDULED").length;
  const overdueCount = maintenance.filter(item => isOverdue(item.nextDueAt)).length;
  const inProgressCount = maintenance.filter(item => item.status === "IN_PROGRESS").length;

  const MaintenanceForm = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid items-center gap-2">
          <Label htmlFor="vehicleRegistration">Vehicle</Label>
          <Input
            id="vehicleRegistration"
            placeholder="TRUCK-101"
            value={formData.vehicleRegistration}
            onChange={(e) => setFormData({ ...formData, vehicleRegistration: e.target.value })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {maintenanceTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid items-center gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              {maintenanceStatuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="cost">Estimated Cost ($)</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid items-center gap-2">
          <Label htmlFor="performedAt">Performed Date</Label>
          <Input
            id="performedAt"
            type="date"
            value={formData.performedAt}
            onChange={(e) => setFormData({ ...formData, performedAt: e.target.value })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="nextDueAt">Next Due Date</Label>
          <Input
            id="nextDueAt"
            type="date"
            value={formData.nextDueAt}
            onChange={(e) => setFormData({ ...formData, nextDueAt: e.target.value })}
          />
        </div>
      </div>
      <div className="grid items-center gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Maintenance</h1>
          <p className="text-gray-600">Manage fleet maintenance schedules and records</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost (MTD)</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Maintenance expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground">Pending maintenance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Currently being serviced</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Records</CardTitle>
          <CardDescription>
            Track all maintenance activities and schedules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search maintenance records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaintenance.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.vehicleRegistration}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {item.performedAt ? <div>Done: {item.performedAt}</div> : null}
                      {item.nextDueAt ? <div className={isOverdue(item.nextDueAt) ? "text-red-600 font-bold" : "text-muted-foreground"}>Due: {item.nextDueAt}</div> : null}
                    </div>
                  </TableCell>
                  <TableCell>${item.cost.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(item)} className="text-red-600">
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
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>Create a new maintenance record.</DialogDescription>
          </DialogHeader>
          <MaintenanceForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Maintenance</DialogTitle>
            <DialogDescription>Update maintenance details.</DialogDescription>
          </DialogHeader>
          <MaintenanceForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Maintenance Details</DialogTitle>
            <DialogDescription>{selectedRecord?.vehicleRegistration}</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Type</div>
                  <div><Badge variant={getTypeColor(selectedRecord.type)}>{selectedRecord.type}</Badge></div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div><Badge variant={getStatusColor(selectedRecord.status)}>{selectedRecord.status}</Badge></div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Description</div>
                <div>{selectedRecord.description}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Cost</div>
                  <div className="text-lg font-bold">${selectedRecord.cost}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Provider</div>
                  <div>{selectedRecord.performedBy || "N/A"}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Performed</div>
                  <div>{selectedRecord.performedAt || "Pending"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Next Due</div>
                  <div>{selectedRecord.nextDueAt || "N/A"}</div>
                </div>
              </div>
              <div className="bg-muted p-3 rounded-md mt-2">
                <div className="text-xs font-medium text-muted-foreground">Notes</div>
                <div className="text-sm">{selectedRecord.notes || "No notes"}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedRecord) handleEdit(selectedRecord); }}>
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
            <AlertDialogTitle>Delete Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the maintenance record for <strong>{selectedRecord?.vehicleRegistration}</strong>.
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