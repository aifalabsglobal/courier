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
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, TrendingUp, TrendingDown, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Inventory {
  id: string;
  warehouseName: string;
  locationCode: string;
  skuCode: string;
  skuName: string;
  batchNo: string;
  quantity: number;
  reservedQty: number;
  availableQty: number;
  status: string;
  lastCountedAt: string;
  expiryDate?: string;
}

const mockInventory: Inventory[] = [
  {
    id: "1",
    warehouseName: "Main Warehouse",
    locationCode: "A-01-01",
    skuCode: "SKU001",
    skuName: "Electronics Box - Medium",
    batchNo: "BATCH001",
    quantity: 100,
    reservedQty: 20,
    availableQty: 80,
    status: "AVAILABLE",
    lastCountedAt: "2024-01-10",
    expiryDate: "2024-12-31",
  },
  {
    id: "2",
    warehouseName: "Main Warehouse",
    locationCode: "B-02-03",
    skuCode: "SKU002",
    skuName: "Furniture Parts - Large",
    batchNo: "BATCH002",
    quantity: 50,
    reservedQty: 10,
    availableQty: 40,
    status: "AVAILABLE",
    lastCountedAt: "2024-01-08",
  },
  {
    id: "3",
    warehouseName: "Distribution Center",
    locationCode: "C-01-02",
    skuCode: "SKU003",
    skuName: "Clothing Bundle",
    batchNo: "BATCH003",
    quantity: 200,
    reservedQty: 150,
    availableQty: 50,
    status: "RESERVED",
    lastCountedAt: "2024-01-12",
    expiryDate: "2024-06-30",
  },
  {
    id: "4",
    warehouseName: "Main Warehouse",
    locationCode: "D-03-01",
    skuCode: "SKU004",
    skuName: "Food Items - Perishable",
    batchNo: "BATCH004",
    quantity: 75,
    reservedQty: 0,
    availableQty: 75,
    status: "QUARANTINE",
    lastCountedAt: "2024-01-11",
    expiryDate: "2024-02-15",
  },
  {
    id: "5",
    warehouseName: "Distribution Center",
    locationCode: "A-02-01",
    skuCode: "SKU005",
    skuName: "Industrial Tools",
    batchNo: "BATCH005",
    quantity: 30,
    reservedQty: 5,
    availableQty: 25,
    status: "AVAILABLE",
    lastCountedAt: "2024-01-09",
  },
];

const inventoryStatuses = ["AVAILABLE", "RESERVED", "DAMAGED", "QUARANTINE"];

export default function InventoryPage() {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<Inventory[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);

  const [formData, setFormData] = useState({
    warehouseName: "",
    locationCode: "",
    skuCode: "",
    skuName: "",
    batchNo: "",
    quantity: 0,
    reservedQty: 0,
    status: "AVAILABLE",
    expiryDate: "",
  });

  const filteredInventory = inventory.filter(
    (item) =>
      item.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      warehouseName: "",
      locationCode: "",
      skuCode: "",
      skuName: "",
      batchNo: "",
      quantity: 0,
      reservedQty: 0,
      status: "AVAILABLE",
      expiryDate: "",
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newItem: Inventory = {
      id: Date.now().toString(),
      warehouseName: formData.warehouseName,
      locationCode: formData.locationCode,
      skuCode: formData.skuCode,
      skuName: formData.skuName || formData.skuCode,
      batchNo: formData.batchNo,
      quantity: formData.quantity,
      reservedQty: formData.reservedQty,
      availableQty: formData.quantity - formData.reservedQty,
      status: formData.status,
      lastCountedAt: new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || undefined,
    };
    setInventory([...inventory, newItem]);
    setIsCreateDialogOpen(false);
    resetForm();
    setIsLoading(false);
    toast({ title: "Inventory Added", description: "New stock item added successfully." });
  };

  const handleEdit = (item: Inventory) => {
    setSelectedItem(item);
    setFormData({
      warehouseName: item.warehouseName,
      locationCode: item.locationCode,
      skuCode: item.skuCode,
      skuName: item.skuName,
      batchNo: item.batchNo,
      quantity: item.quantity,
      reservedQty: item.reservedQty,
      status: item.status,
      expiryDate: item.expiryDate || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const availableQty = formData.quantity - formData.reservedQty;

    setInventory(
      inventory.map((item) =>
        item.id === selectedItem.id
          ? {
            ...item,
            ...formData,
            availableQty,
          }
          : item
      )
    );
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setIsLoading(false);
    toast({ title: "Inventory Updated", description: "Stock details updated." });
  };

  const handleDeleteClick = (item: Inventory) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setInventory(inventory.filter((item) => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    setIsLoading(false);
    toast({ title: "Inventory Removed", description: "Item removed from inventory.", variant: "destructive" });
  };

  const handleView = (item: Inventory) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleAdjustment = async (id: string, adjustment: number) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    setInventory(
      inventory.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: item.quantity + adjustment,
            availableQty: (item.quantity + adjustment) - item.reservedQty,
            lastCountedAt: new Date().toISOString().split('T')[0],
          }
          : item
      )
    );
    setIsLoading(false);
    toast({ title: "Stock Adjusted", description: `Quantity adjusted by ${adjustment}.` });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "default";
      case "RESERVED": return "secondary";
      case "DAMAGED": return "destructive";
      case "QUARANTINE": return "destructive";
      default: return "outline";
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const totalValue = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalReserved = inventory.reduce((sum, item) => sum + item.reservedQty, 0);
  const totalAvailable = inventory.reduce((sum, item) => sum + item.availableQty, 0);
  const expiringItems = inventory.filter(item => isExpiringSoon(item.expiryDate)).length;
  const expiredItems = inventory.filter(item => isExpired(item.expiryDate)).length;

  const InventoryForm = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid items-center gap-2">
          <Label htmlFor="warehouseName">Warehouse</Label>
          <Input
            id="warehouseName"
            value={formData.warehouseName}
            onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="locationCode">Location</Label>
          <Input
            id="locationCode"
            value={formData.locationCode}
            onChange={(e) => setFormData({ ...formData, locationCode: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid items-center gap-2">
          <Label htmlFor="skuCode">SKU Code</Label>
          <Input
            id="skuCode"
            value={formData.skuCode}
            onChange={(e) => setFormData({ ...formData, skuCode: e.target.value })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="skuName">SKU Name</Label>
          <Input
            id="skuName"
            value={formData.skuName}
            onChange={(e) => setFormData({ ...formData, skuName: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid items-center gap-2">
          <Label htmlFor="batchNo">Batch</Label>
          <Input
            id="batchNo"
            value={formData.batchNo}
            onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="quantity">Total Qty</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="reservedQty">Reserved</Label>
          <Input
            id="reservedQty"
            type="number"
            value={formData.reservedQty}
            onChange={(e) => setFormData({ ...formData, reservedQty: parseInt(e.target.value) })}
          />
        </div>
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
              {inventoryStatuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage warehouse inventory and stock levels</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total quantity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalAvailable.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalReserved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringItems}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredItems}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>
            Current inventory levels across all warehouses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Warehouse / Location</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Quick Adj.</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.skuCode}</div>
                      <div className="text-xs text-muted-foreground max-w-[150px] truncate" title={item.skuName}>{item.skuName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{item.warehouseName}</div>
                      <div className="font-mono text-xs text-muted-foreground">{item.locationCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between w-24"><span>Total:</span> <span className="font-bold">{item.quantity}</span></div>
                      <div className="flex justify-between w-24 text-green-600"><span>Avail:</span> <span className="font-bold">{item.availableQty}</span></div>
                      <div className="flex justify-between w-24 text-yellow-600"><span>Res:</span> <span className="font-bold">{item.reservedQty}</span></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.expiryDate ? (
                      <div className={`text-xs ${isExpired(item.expiryDate) ? "text-red-600 font-bold" : isExpiringSoon(item.expiryDate) ? "text-orange-600" : ""}`}>
                        {item.expiryDate}
                      </div>
                    ) : <span className="text-xs text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleAdjustment(item.id, 1)}
                        title="Add 1"
                      >
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleAdjustment(item.id, -1)}
                        title="Remove 1"
                      >
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
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
            <DialogTitle>Add Inventory</DialogTitle>
            <DialogDescription>Add new stock item.</DialogDescription>
          </DialogHeader>
          <InventoryForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
            <DialogDescription>Update stock details.</DialogDescription>
          </DialogHeader>
          <InventoryForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Inventory Details</DialogTitle>
            <DialogDescription>{selectedItem?.skuCode}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Details</div>
                  <div className="font-bold text-lg">{selectedItem.skuName}</div>
                  <div className="text-sm text-muted-foreground">SKU: {selectedItem.skuCode}</div>
                  <div className="text-sm text-muted-foreground">Batch: {selectedItem.batchNo}</div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusColor(selectedItem.status)}>{selectedItem.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <div className="text-center p-2 bg-muted rounded">
                  <div className="text-sm font-medium text-muted-foreground">Total</div>
                  <div className="font-bold text-xl">{selectedItem.quantity}</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded border border-green-100">
                  <div className="text-sm font-medium text-green-700">Available</div>
                  <div className="font-bold text-xl text-green-700">{selectedItem.availableQty}</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-100">
                  <div className="text-sm font-medium text-yellow-700">Reserved</div>
                  <div className="font-bold text-xl text-yellow-700">{selectedItem.reservedQty}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Location</div>
                  <div>{selectedItem.warehouseName}</div>
                  <div className="font-mono text-sm">{selectedItem.locationCode}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Dates</div>
                  <div className="text-sm">Last Count: {selectedItem.lastCountedAt}</div>
                  {selectedItem.expiryDate && <div className="text-sm text-red-600">Expires: {selectedItem.expiryDate}</div>}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedItem) handleEdit(selectedItem); }}>
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
            <AlertDialogTitle>Remove Inventory?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{selectedItem?.skuCode}</strong> from <strong>{selectedItem?.warehouseName}</strong>.
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