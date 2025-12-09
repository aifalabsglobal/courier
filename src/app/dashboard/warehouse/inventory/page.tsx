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
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

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
  const [inventory, setInventory] = useState<Inventory[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    warehouseName: "",
    locationCode: "",
    skuCode: "",
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

  const handleCreate = () => {
    const newItem: Inventory = {
      id: Date.now().toString(),
      warehouseName: formData.warehouseName,
      locationCode: formData.locationCode,
      skuCode: formData.skuCode,
      skuName: formData.skuCode, // In real app, fetch from SKU master
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
  };

  const handleAdjustment = (id: string, adjustment: number) => {
    setInventory(
      inventory.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + adjustment,
              availableQty: item.availableQty + adjustment,
              lastCountedAt: new Date().toISOString().split('T')[0],
            }
          : item
      )
    );
  };

  const resetForm = () => {
    setFormData({
      warehouseName: "",
      locationCode: "",
      skuCode: "",
      batchNo: "",
      quantity: 0,
      reservedQty: 0,
      status: "AVAILABLE",
      expiryDate: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "default";
      case "RESERVED":
        return "secondary";
      case "DAMAGED":
        return "destructive";
      case "QUARANTINE":
        return "destructive";
      default:
        return "outline";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage warehouse inventory and stock levels</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Inventory</DialogTitle>
              <DialogDescription>
                Add new stock to warehouse inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                  <Label htmlFor="locationCode">Location Code</Label>
                  <Input
                    id="locationCode"
                    placeholder="A-01-01"
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
                  <Label htmlFor="batchNo">Batch No</Label>
                  <Input
                    id="batchNo"
                    value={formData.batchNo}
                    onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="reservedQty">Reserved Qty</Label>
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
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
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
            <DialogFooter>
              <Button type="submit" onClick={handleCreate}>
                Add Stock
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <p className="text-xs text-muted-foreground">Total quantity across all warehouses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalAvailable.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available for allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalReserved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Reserved for orders</p>
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
                <TableHead>Warehouse</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Reserved</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.warehouseName}</TableCell>
                  <TableCell className="font-medium">{item.locationCode}</TableCell>
                  <TableCell className="font-medium">{item.skuCode}</TableCell>
                  <TableCell>{item.skuName}</TableCell>
                  <TableCell>{item.batchNo}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.quantity}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-green-600 font-medium">{item.availableQty}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-yellow-600">{item.reservedQty}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.expiryDate && (
                      <Badge
                        variant={
                          isExpired(item.expiryDate)
                            ? "destructive"
                            : isExpiringSoon(item.expiryDate)
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {item.expiryDate}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAdjustment(item.id, 10)}
                      >
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAdjustment(item.id, -10)}
                      >
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}